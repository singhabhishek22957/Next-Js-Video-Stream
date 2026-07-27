import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { Video } from "@/models/video.model";
import fs from "fs";
import path from "path";
import os from "os";
import axios from "axios";

import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";
import { generateSlug } from "@/lib/generateSlug";

function slugifyFileName(fileName: string) {
  const ext = path.extname(fileName);
  const name = path.basename(fileName, ext);

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // spaces -> -
    .replace(/[^a-z0-9-]/g, "") // remove special chars
    .replace(/-+/g, "-"); // remove duplicate -

  return `${slug}${ext.toLowerCase()}`;
}

export async function POST(request: NextRequest) {
  let lessonId = "";
  try {
    await connectDB();
    lessonId = uuidv4();
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return new NextResponse("You are not logged in", { status: 401 });
    }
    const formData = await request.formData();

    if (
      !formData.get("thumbnail") ||
      !formData.get("video") ||
      !formData.get("title") ||
      !formData.get("genre") ||
      !formData.get("duration")
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const title = formData.get("title") as string;

    const description = formData.get("description") as string;

    const duration = Number(formData.get("duration"));

    const region = formData.get("region") as string;

    const language = formData.get("language") as string;

    const rawStatus = formData.get("status");

    const status: "published" | "unlisted" =
      rawStatus === "unlisted" ? "unlisted" : "published";

    const actors = JSON.parse(String(formData.get("actors") || "[]"));

    const genre = JSON.parse(String(formData.get("genre") || "[]"));

    const tags = JSON.parse(String(formData.get("tags") || "[]"));

    const thumbnail = formData.get("thumbnail") as File;

    const video = formData.get("video") as File;

    // -------------------------
    // CREATE TEMP DIRECTORY
    // -------------------------

    const rootUploadDir = path.join(os.tmpdir(), "uploads", lessonId);

    fs.mkdirSync(rootUploadDir, {
      recursive: true,
    });

    // -------------------------
    // SAVE HLS FILES
    // -------------------------

    // -------------------------
    // SAVE THUMBNAIL
    // -------------------------

    const thumbnailPath = path.join(rootUploadDir, thumbnail.name);

    fs.writeFileSync(thumbnailPath, Buffer.from(await thumbnail.arrayBuffer()));

    // -------------------------
    // SAVE PREVIEW VIDEO
    // -------------------------

    const videoPath = path.join(rootUploadDir, video.name);

    fs.writeFileSync(videoPath, Buffer.from(await video.arrayBuffer()));

    // -------------------------
    // GENERATE SLUG
    // -------------------------

    const slug = await generateSlug(title);

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Title already exists",
        },
        {
          status: 400,
        },
      );
    }

    // -------------------------
    // BUNNY UPLOAD HELPERS
    // -------------------------

    async function uploadFileToBunny(
      localPath: string,
      remotePath: string,
      contentType: string,
    ) {
      await axios.put(
        `${process.env.BUNNY_ENDPOINT}/${process.env.BUNNY_BUCKET}/${remotePath}`,
        fs.readFileSync(localPath),
        {
          headers: {
            AccessKey: process.env.BUNNY_ACCESS_KEY!,
            "Content-Type": contentType,
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        },
      );
    }

    // -------------------------
    // UPLOAD HLS
    // -------------------------
    const videoName = slugifyFileName(video.name);

    await uploadFileToBunny(
      videoPath,
      `videomp4/${lessonId}/${videoName}`,
      "video/mp4",
    );
    // UPLOAD THUMBNAIL
    // -------------------------

    const thumbnailName = slugifyFileName(thumbnail.name);

    await uploadFileToBunny(
      thumbnailPath,
      `thumbnailmp4/${lessonId}/${thumbnailName}`,
      "image/jpeg",
    );

    // -------------------------
    // UPLOAD PREVIEW VIDEO
    // -------------------------

    const thumbnailUrl = `${process.env.BUNNY_HOSTNAME}/thumbnailmp4/${lessonId}/${thumbnailName}`;

    const videoUrl = `${process.env.BUNNY_HOSTNAME}/videomp4/${lessonId}/${videoName}`;

    const video_mp4 = await Video.create({
      lessonId,
      uploader: user?.id,
      title,
      slug,

      description,

      duration,

      videoUrl,

      thumbnailUrl,

      previewVideoUrl: videoUrl,

      actors,

      genre,

      region,

      language,

      tags,

      status,

      views: 0,
      likes: 0,
    });

    return NextResponse.json({
      success: true,
      video: video_mp4,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Upload failed",
      },
      {
        status: 500,
      },
    );
  } finally {
    if (lessonId) {
      const tempFolder = path.join(os.tmpdir(), "uploads", lessonId);

      if (fs.existsSync(tempFolder)) {
        fs.rmSync(tempFolder, {
          recursive: true,
          force: true,
        });
      }
    }
  }
}
