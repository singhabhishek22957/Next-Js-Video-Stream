
import { NextRequest, NextResponse } from "next/server";

import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import axios from "axios";

import { connectDB } from "@/lib/db";
import { ImageModel } from "@/models/image.model";

// -------------------------
// BUNNY UPLOAD
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
        AccessKey:
          process.env.BUNNY_ACCESS_KEY!,
        "Content-Type": contentType,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    },
  );
}

// -------------------------
// GET ALL IMAGES
// -------------------------

export async function GET() {
  try {
    await connectDB();

    const images =
      await ImageModel.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch images",
      },
      {
        status: 500,
      },
    );
  }
}

// -------------------------
// CREATE IMAGE
// -------------------------

export async function POST(
  req: NextRequest,
) {
  let tempFilePath = "";

  try {
    await connectDB();

    const formData =
      await req.formData();

    const title =
      formData.get("title")?.toString() ||
      "";

    const image =
      formData.get("image") as File;

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Title is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Image is required",
        },
        {
          status: 400,
        },
      );
    }

    const buffer = Buffer.from(
      await image.arrayBuffer(),
    );

    const folderId =
      crypto.randomUUID();

    const fileName =
      image.name.replaceAll(
        " ",
        "-",
      );

    tempFilePath = path.join(
      os.tmpdir(),
      fileName,
    );

    fs.writeFileSync(
      tempFilePath,
      buffer,
    );

    const bunnyPath =
      `extraImages/${folderId}/${fileName}`;

    await uploadFileToBunny(
      tempFilePath,
      bunnyPath,
      image.type,
    );

    const imageUrl =
      `${process.env.BUNNY_HOSTNAME}/${bunnyPath}`;

    const createdImage =
      await ImageModel.create({
        title,
        imageUrl,
        bunnyPath,
      });

    if (
      fs.existsSync(
        tempFilePath,
      )
    ) {
      fs.unlinkSync(
        tempFilePath,
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Image uploaded successfully",
      image:
        JSON.parse(
          JSON.stringify(
            createdImage,
          ),
        ),
    });
  } catch (error) {
    console.error(error);

    if (
      tempFilePath &&
      fs.existsSync(
        tempFilePath,
      )
    ) {
      fs.unlinkSync(
        tempFilePath,
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to upload image",
      },
      {
        status: 500,
      },
    );
  }
}
