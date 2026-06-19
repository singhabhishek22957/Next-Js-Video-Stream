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
      !formData.get("previewVideo") ||
      !formData.get("videoFiles") ||
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

    const previewVideo = formData.get("previewVideo") as File;

    const videoFiles = formData.getAll("videoFiles") as File[];

    // -------------------------
    // CREATE TEMP DIRECTORY
    // -------------------------

    const rootUploadDir = path.join(os.tmpdir(), "uploads", lessonId);

    const videoDir = path.join(rootUploadDir, "video");

    fs.mkdirSync(videoDir, {
      recursive: true,
    });

    // -------------------------
    // SAVE HLS FILES
    // -------------------------

    for (const file of videoFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());

      fs.writeFileSync(path.join(videoDir, file.name), buffer);
    }

    // -------------------------
    // SAVE THUMBNAIL
    // -------------------------

    const thumbnailPath = path.join(rootUploadDir, thumbnail.name);

    fs.writeFileSync(thumbnailPath, Buffer.from(await thumbnail.arrayBuffer()));

    // -------------------------
    // SAVE PREVIEW VIDEO
    // -------------------------

    let previewVideoPath = "";

    if (previewVideo) {
      previewVideoPath = path.join(rootUploadDir, previewVideo.name);

      fs.writeFileSync(
        previewVideoPath,
        Buffer.from(await previewVideo.arrayBuffer()),
      );
    }

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

    async function uploadFolder(localFolder: string, remotePrefix = "") {
      const files = fs.readdirSync(localFolder);

      for (const file of files) {
        const filePath = path.join(localFolder, file);

        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
          const key = path.join(remotePrefix, file).replace(/\\/g, "/");

          const contentType = file.endsWith(".m3u8")
            ? "application/vnd.apple.mpegurl"
            : file.endsWith(".ts")
              ? "video/mp2t"
              : file.endsWith(".m4s")
                ? "video/iso.segment"
                : file.endsWith(".mp4")
                  ? "video/mp4"
                  : "application/octet-stream";

          await uploadFileToBunny(filePath, key, contentType);
        } else {
          await uploadFolder(filePath, path.join(remotePrefix, file));
        }
      }
    }

    // -------------------------
    // UPLOAD HLS
    // -------------------------

    await uploadFolder(videoDir, `videos/${lessonId}`);

    // -------------------------
    // UPLOAD THUMBNAIL
    // -------------------------

    const thumbnailName = path.basename(thumbnailPath);

    await uploadFileToBunny(
      thumbnailPath,
      `thumbnail/${lessonId}/${thumbnailName}`,
      "image/jpeg",
    );

    // -------------------------
    // UPLOAD PREVIEW VIDEO
    // -------------------------

    let previewVideoUrl = "";

    if (previewVideoPath && fs.existsSync(previewVideoPath)) {
      const previewName = path.basename(previewVideoPath);

      await uploadFileToBunny(
        previewVideoPath,
        `preview-video/${lessonId}/${previewName}`,
        "video/mp4",
      );

      previewVideoUrl = `${process.env.BUNNY_HOSTNAME}/preview-video/${lessonId}/${previewName}`;
    }

    const thumbnailUrl = `${process.env.BUNNY_HOSTNAME}/thumbnail/${lessonId}/${thumbnailName}`;

    const videoUrl = `${process.env.BUNNY_HOSTNAME}/videos/${lessonId}/master.m3u8`;

    const video = await Video.create({
      lessonId,
      uploader: user?.id,
      title,
      slug,

      description,

      duration,

      videoUrl,

      thumbnailUrl,

      previewVideoUrl,

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
      video,
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
