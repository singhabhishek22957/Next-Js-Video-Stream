"use server";

import { connectDB } from "@/lib/db";
import { Video } from "@/models/video.model";

export async function checkSlugAvailability(
  slug: string
) {
  try {
    await connectDB();

    const existing =
      await Video.findOne({
        slug,
        isDeleted: false,
      }).lean();

    return {
      available: !existing,
    };
  } catch (error) {
    console.error(error);

    return {
      available: false,
    };
  }
}