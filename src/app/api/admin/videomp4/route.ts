import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Video } from "@/models/video.model";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return new NextResponse("You are not logged in", { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      duration,
      region,
      language,
      status,
      actors,
      genre,
      tags,
      thumbnailUrl,
      videoUrl,
      slug,
    } = body;

    if (
      !title ||
      !slug ||
      !thumbnailUrl ||
      !videoUrl ||
      !duration ||
      !genre?.length
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingVideo = await Video.findOne({ slug });

    if (existingVideo) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug already exists",
        },
        {
          status: 409,
        },
      );
    }

    const video = await Video.create({
      uploader: user.id,
      title,
      slug,
      description,
      duration,
      thumbnailUrl,
      videoUrl,
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
      video: video,
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
  }
}
