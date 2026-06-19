"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import Region from "@/models/region.model";

export async function createRegionAction(
  name: string,
  code: string,
  thumbnailUrl: string,
) {
  try {
    await connectDB();

    const exists =
      await Region.findOne({
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
          "Region already exists",
      };
    }

    await Region.create({
      name,
      thumbnailUrl,
      code:
        code.toUpperCase(),
    });

    revalidatePath(
      "/admin/regions"
    );

    return {
      success: true,
      message:
        "Region created successfully",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        "Failed to create region",
    };
  }
}

export async function getAllRegionsAction() {
  try {
    await connectDB();

    const regions =
      await Region.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return {
      success: true,
      regions:
        JSON.parse(
          JSON.stringify(
            regions
          )
        ),
    };
  } catch {
    return {
      success: false,
      regions: [],
    };
  }
}

export async function updateRegionAction(
  id: string,
  name: string,
  code: string,
  thumbnailUrl: string,
) {
  try {
    await connectDB();

    const exists =
      await Region.findOne({
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
          "Region already exists",
      };
    }

    await Region.findByIdAndUpdate(
      id,
      {
        name,
        thumbnailUrl,
        code:
          code.toUpperCase(),
      }
    );

    revalidatePath(
      "/admin/regions"
    );

    return {
      success: true,
      message:
        "Region updated successfully",
    };
  } catch {
    return {
      success: false,
      message:
        "Failed to update region",
    };
  }
}

export async function deleteRegionAction(
  id: string
) {
  try {
    await connectDB();

    await Region.findByIdAndDelete(
      id
    );

    revalidatePath(
      "/admin/regions"
    );

    return {
      success: true,
      message:
        "Region deleted successfully",
    };
  } catch {
    return {
      success: false,
      message:
        "Failed to delete region",
    };
  }
}

export async function toggleRegionStatusAction(
  id: string
) {
  try {
    await connectDB();

    const region =
      await Region.findById(id);

    if (!region) {
      return {
        success: false,
        message:
          "Region not found",
      };
    }

    region.isActive =
      !region.isActive;

    await region.save();

    revalidatePath(
      "/admin/regions"
    );

    return {
      success: true,
      message: `Region ${
        region.isActive
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