"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import Language from "@/models/language.model";

export async function createLanguageAction(
  name: string,
  code: string,
  thumbnailUrl: string,
) {
  try {
    await connectDB();

    const exists =
      await Language.findOne({
        $or: [
          { name },
          {
            code:
              code.toUpperCase(),
          },
        ],
      });

    if (exists) {
      return {
        success: false,
        message:
          "Language already exists",
      };
    }

    await Language.create({
      name,
      thumbnailUrl,
      code:
        code.toUpperCase(),
    });

    revalidatePath(
      "/admin/languages"
    );

    return {
      success: true,
      message:
        "Language created successfully",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        "Failed to create language",
    };
  }
}

export async function getAllLanguagesAction() {
  try {
    await connectDB();

    const languages =
      await Language.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return {
      success: true,
      languages:
        JSON.parse(
          JSON.stringify(
            languages
          )
        ),
    };
  } catch {
    return {
      success: false,
      languages: [],
    };
  }
}

export async function updateLanguageAction(
  id: string,
  name: string,
  code: string,
  thumbnailUrl: string,
) {
  try {
    await connectDB();

    const exists =
      await Language.findOne({
        _id: {
          $ne: id,
        },
        $or: [
          { name },
          {
            code:
              code.toUpperCase(),
          },
        ],
      });

    if (exists) {
      return {
        success: false,
        message:
          "Language already exists",
      };
    }

    await Language.findByIdAndUpdate(
      id,
      {
        name,
        thumbnailUrl,
        code:
          code.toUpperCase(),
      }
    );

    revalidatePath(
      "/admin/languages"
    );

    return {
      success: true,
      message:
        "Language updated successfully",
    };
  } catch {
    return {
      success: false,
      message:
        "Failed to update language",
    };
  }
}

export async function deleteLanguageAction(
  id: string
) {
  try {
    await connectDB();

    await Language.findByIdAndDelete(
      id
    );

    revalidatePath(
      "/admin/languages"
    );

    return {
      success: true,
      message:
        "Language deleted successfully",
    };
  } catch {
    return {
      success: false,
      message:
        "Failed to delete language",
    };
  }
}

export async function toggleLanguageStatusAction(
  id: string
) {
  try {
    await connectDB();

    const language =
      await Language.findById(id);

    if (!language) {
      return {
        success: false,
        message:
          "Language not found",
      };
    }

    language.isActive =
      !language.isActive;

    await language.save();

    revalidatePath(
      "/admin/languages"
    );

    return {
      success: true,
      message:
        `Language ${
          language.isActive
            ? "activated"
            : "deactivated"
        } successfully`,
    };
  } catch {
    return {
      success: false,
      message:
        "Failed to update status",
    };
  }
}