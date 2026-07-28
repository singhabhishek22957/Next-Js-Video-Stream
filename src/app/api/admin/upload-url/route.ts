import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

import { bunny } from "@/lib/bunny";

export async function POST(req: Request) {
  try {
    const { fileName, contentType, type } = await req.json();

    if (!fileName || !contentType || !type) {
      return NextResponse.json(
        {
          message: "fileName, contentType and type are required",
        },
        { status: 400 }
      );
    }

    if (!["video", "thumbnail"].includes(type)) {
      return NextResponse.json(
        { message: "Invalid upload type" },
        { status: 400 }
      );
    }

    const folder =
      type === "video" ? "videomp4" : "thumbnailmp4";

    const key = `${folder}/${randomUUID()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.BUNNY_BUCKET_S3!,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(bunny, command, {
      expiresIn: 300,
    });

    return NextResponse.json({
      uploadUrl,
      fileUrl: `${process.env.BUNNY_HOSTNAME_S3}/${key}`,
    });
  } catch (error) {
    console.error("error",error);

    return NextResponse.json(
      { message: "Unable to generate upload URL" },
      { status: 500 }
    );
  }
}