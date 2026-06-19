"use server";

import { revalidatePath } from "next/cache";
import {connectDB} from "@/lib/db";
import Genre from "@/models/genre.model";


export async function createGenreAction(
  name: string,
  description?: string,
  thumbnailUrl?: string
) {
  try {
    await connectDB();

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const existing =
      await Genre.findOne({
        $or: [
          { name },
          { slug },
        ],
      });

    if (existing) {
      return {
        success: false,
        message:
          "Genre already exists",
      };
    }

    const genre =
      await Genre.create({
        name,
        slug,
        description,
        thumbnailUrl,
      });

    revalidatePath(
      "/admin/genres"
    );

    return {
      success: true,
      message:
        "Genre created successfully",
      genre:
        JSON.parse(
          JSON.stringify(
            genre
          )
        ),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        "Failed to create genre",
    };
  }
}


export async function getAllGenresAction() {
  try {
    await connectDB();

    const genres =
      await Genre.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return {
      success: true,
      genres: JSON.parse(
        JSON.stringify(
          genres
        )
      ),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      genres: [],
    };
  }
}



export async function getGenreByIdAction(
  id: string
) {
  try {
    await connectDB();

    const genre =
      await Genre.findById(
        id
      ).lean();

    if (!genre) {
      return {
        success: false,
        message:
          "Genre not found",
      };
    }

    return {
      success: true,
      genre: JSON.parse(
        JSON.stringify(
          genre
        )
      ),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        "Failed to fetch genre",
    };
  }
}


export async function updateGenreAction(
  id: string,
  data: {
    name: string;
    description?: string;
    isActive?: boolean;
    thumbnailUrl?: string;
  }
) {
  try {
    await connectDB();

    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const genre =
      await Genre.findByIdAndUpdate(
        id,
        {
          ...data,
          slug,
        },
        {
          new: true,
        }
      );

    if (!genre) {
      return {
        success: false,
        message:
          "Genre not found",
      };
    }

    revalidatePath(
      "/admin/genres"
    );

    return {
      success: true,
      message:
        "Genre updated successfully",
      genre:
        JSON.parse(
          JSON.stringify(
            genre
          )
        ),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        "Failed to update genre",
    };
  }
}


export async function deleteGenreAction(
  id: string
) {
  try {
    await connectDB();

    const genre =
      await Genre.findByIdAndDelete(
        id
      );

    if (!genre) {
      return {
        success: false,
        message:
          "Genre not found",
      };
    }

    revalidatePath(
      "/admin/genres"
    );

    return {
      success: true,
      message:
        "Genre deleted successfully",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        "Failed to delete genre",
    };
  }
}



export async function toggleGenreStatusAction(
  id: string
) {
  try {
    await connectDB();

    const genre =
      await Genre.findById(
        id
      );

    if (!genre) {
      return {
        success: false,
        message:
          "Genre not found",
      };
    }

    genre.isActive =
      !genre.isActive;

    await genre.save();

    revalidatePath(
      "/admin/genres"
    );

    return {
      success: true,
      message:
        "Genre status updated",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        "Failed to update status",
    };
  }
}