
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

import { connectDB } from "@/lib/db";
import { ImageModel } from "@/models/image.model";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// ----------------------------------
// GET SINGLE IMAGE
// ----------------------------------

export async function GET(
  req: NextRequest,
  { params }: RouteParams,
) {
  try {
    await connectDB();

    const { id } = await params;

    const image =
      await ImageModel.findById(id).lean();

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: "Image not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch image",
      },
      { status: 500 },
    );
  }
}

// ----------------------------------
// UPDATE IMAGE TITLE
// ----------------------------------

export async function PUT(
  req: NextRequest,
  { params }: RouteParams,
) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await req.json();

    const { title } = body;

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 },
      );
    }

    const image =
      await ImageModel.findByIdAndUpdate(
        id,
        {
          title,
        },
        {
          new: true,
        },
      ).lean();

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: "Image not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image updated",
      image,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update image",
      },
      { status: 500 },
    );
  }
}

// ----------------------------------
// DELETE IMAGE
// ----------------------------------

export async function DELETE(
  req: NextRequest,
  { params }: RouteParams,
) {
  try {
    await connectDB();

    const { id } = await params;

    const image =
      await ImageModel.findById(id);

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: "Image not found",
        },
        { status: 404 },
      );
    }

    // Delete from Bunny Storage

    await axios.delete(
      `${process.env.BUNNY_ENDPOINT}/${process.env.BUNNY_BUCKET}/${image.bunnyPath}`,
      {
        headers: {
          AccessKey:
            process.env.BUNNY_ACCESS_KEY!,
        },
      },
    );

    // Delete Mongo Record

    await ImageModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Image deleted",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete image",
      },
      { status: 500 },
    );
  }
}
