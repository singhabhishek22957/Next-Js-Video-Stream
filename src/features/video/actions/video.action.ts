"use server";

import { connectDB } from "@/lib/db";
import { Video } from "@/models/video.model";

export async function getVideoBySlugAction(slug: string) {
  try {
    await connectDB();

    const video = await Video.findOne({
      slug,
      isDeleted: false,
      status: "published",
    })
      .populate({
        path: "genre",
        select: "name slug",
      })
      .populate({
        path: "region",
        select: "name slug",
      })
      .populate({
        path: "language",
        select: "name slug",
      })
      .lean();

    if (!video) {
      return {
        success: false,
        message: "Video not found",
      };
    }

    return {
      success: true,
      video: JSON.parse(JSON.stringify(video)),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to fetch video",
    };
  }
}

const VIDEO_LIMIT = 20;

export async function getAllVideosAction(
  page: number = 1,
  pageSize: number = VIDEO_LIMIT,
  search: string = "",
  sortBy: string = "updatedAt",
  sortOrder: "asc" | "desc" = "desc",
) {
  try {
    await connectDB();

    const currentPage = Number(page) || 1;

    const skip = (currentPage - 1) * pageSize;

    const matchStage: any = {
      isDeleted: false,
      status: "published",
    };

    // Search
    if (search.trim()) {
      matchStage.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Allowed sort fields
    const allowedSortFields = [
      "title",
      "views",
      "likes",
      "duration",
      "createdAt",
      "updatedAt",
    ];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "updatedAt";

    const result = await Video.aggregate([
      {
        $match: matchStage,
      },
      {
        $addFields: {
          _id: {
            $toString: "$_id",
          },
        },
      },
      {
        $sort: {
          [sortField]: sortOrder === "asc" ? 1 : -1,
        },
      },
      {
        $facet: {
          data: [
            {
              $skip: skip,
            },
            {
              $limit: pageSize,
            },
          ],
          totalCount: [
            {
              $count: "total",
            },
          ],
        },
      },
    ]);

    const videos = result[0]?.data || [];

    const total = result[0]?.totalCount?.[0]?.total || 0;

    return {
      success: true,
      message: "Videos fetched successfully",
      videos: structuredClone(videos),
      currentPage,
      totalPages: Math.ceil(total / pageSize),
      totalVideos: total,
      pageSize,
      search,
      sortBy: sortField,
      sortOrder,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to fetch videos",
      videos: [],
      currentPage: 1,
      totalPages: 0,
      totalVideos: 0,
      pageSize,
      search,
      sortBy,
      sortOrder,
    };
  }
}

export async function getAllUnlistedVideosAction(
  page: number = 1,
  pageSize: number = VIDEO_LIMIT,
  search: string = "",
  sortBy: string = "updatedAt",
  sortOrder: "asc" | "desc" = "desc",
) {
  try {
    await connectDB();

    const currentPage = Number(page) || 1;

    const skip = (currentPage - 1) * pageSize;

    const matchStage: any = {
      status: "unlisted",
    };

    // Search
    if (search.trim()) {
      matchStage.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Allowed sort fields
    const allowedSortFields = [
      "title",
      "views",
      "likes",
      "duration",
      "createdAt",
      "updatedAt",
    ];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "updatedAt";

    const result = await Video.aggregate([
      {
        $match: matchStage,
      },
      {
        $addFields: {
          _id: {
            $toString: "$_id",
          },
        },
      },
      {
        $sort: {
          [sortField]: sortOrder === "asc" ? 1 : -1,
        },
      },
      {
        $facet: {
          data: [
            {
              $skip: skip,
            },
            {
              $limit: pageSize,
            },
          ],
          totalCount: [
            {
              $count: "total",
            },
          ],
        },
      },
    ]);

    const videos = result[0]?.data || [];

    const total = result[0]?.totalCount?.[0]?.total || 0;

    return {
      success: true,
      message: "Videos fetched successfully",
      videos: structuredClone(videos),
      currentPage,
      totalPages: Math.ceil(total / pageSize),
      totalVideos: total,
      pageSize,
      search,
      sortBy: sortField,
      sortOrder,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to fetch videos",
      videos: [],
      currentPage: 1,
      totalPages: 0,
      totalVideos: 0,
      pageSize,
      search,
      sortBy,
      sortOrder,
    };
  }
}

export async function getAllDeletedVideosAction(
  page: number = 1,
  pageSize: number = VIDEO_LIMIT,
  search: string = "",
  sortBy: string = "updatedAt",
  sortOrder: "asc" | "desc" = "desc",
) {
  try {
    await connectDB();

    const currentPage = Number(page) || 1;

    const skip = (currentPage - 1) * pageSize;

    const matchStage: any = {
      isDeleted: true,
    };

    // Search
    if (search.trim()) {
      matchStage.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Allowed sort fields
    const allowedSortFields = [
      "title",
      "views",
      "likes",
      "duration",
      "createdAt",
      "updatedAt",
    ];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "updatedAt";

    const result = await Video.aggregate([
      {
        $match: matchStage,
      },
      {
        $addFields: {
          _id: {
            $toString: "$_id",
          },
        },
      },
      {
        $sort: {
          [sortField]: sortOrder === "asc" ? 1 : -1,
        },
      },
      {
        $facet: {
          data: [
            {
              $skip: skip,
            },
            {
              $limit: pageSize,
            },
          ],
          totalCount: [
            {
              $count: "total",
            },
          ],
        },
      },
    ]);

    const videos = result[0]?.data || [];

    const total = result[0]?.totalCount?.[0]?.total || 0;

    return {
      success: true,
      message: "Videos fetched successfully",
      videos: structuredClone(videos),
      currentPage,
      totalPages: Math.ceil(total / pageSize),
      totalVideos: total,
      pageSize,
      search,
      sortBy: sortField,
      sortOrder,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to fetch videos",
      videos: [],
      currentPage: 1,
      totalPages: 0,
      totalVideos: 0,
      pageSize,
      search,
      sortBy,
      sortOrder,
    };
  }
}

import mongoose from "mongoose";
export async function getAllVideosByUploaderAction(
  page: number = 1,
  pageSize: number = VIDEO_LIMIT,
  search: string = "",
  sortBy: string = "updatedAt",
  sortOrder: "asc" | "desc" = "desc",
  id: string,
) {
  try {
    await connectDB();

    const currentPage = Number(page) || 1;

    const skip = (currentPage - 1) * pageSize;

    const matchStage: any = {
      isDeleted: false,
      status: "published",
      uploader: new mongoose.Types.ObjectId(id),
    };

    // Search
    if (search.trim()) {
      matchStage.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Allowed sort fields
    const allowedSortFields = [
      "title",
      "views",
      "likes",
      "duration",
      "createdAt",
      "updatedAt",
    ];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "updatedAt";

    const result = await Video.aggregate([
      {
        $match: matchStage,
      },
      {
        $addFields: {
          _id: {
            $toString: "$_id",
          },
        },
      },
      {
        $sort: {
          [sortField]: sortOrder === "asc" ? 1 : -1,
        },
      },
      {
        $facet: {
          data: [
            {
              $skip: skip,
            },
            {
              $limit: pageSize,
            },
          ],
          totalCount: [
            {
              $count: "total",
            },
          ],
        },
      },
    ]);

    const videos = result[0]?.data || [];

    const total = result[0]?.totalCount?.[0]?.total || 0;

    return {
      success: true,
      message: "Videos fetched successfully",
      videos: structuredClone(videos),
      currentPage,
      totalPages: Math.ceil(total / pageSize),
      totalVideos: total,
      pageSize,
      search,
      sortBy: sortField,
      sortOrder,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to fetch videos",
      videos: [],
      currentPage: 1,
      totalPages: 0,
      totalVideos: 0,
      pageSize,
      search,
      sortBy,
      sortOrder,
    };
  }
}

import { revalidatePath } from "next/cache";

export async function updateLikesAction(id: string) {
  try {
    await connectDB();

    const video = await Video.findByIdAndUpdate(
      id,
      {
        $inc: {
          likes: 1,
        },
      },
      {
        new: true,
      },
    );

    if (!video) {
      return {
        success: false,
        message: "Video not found",
      };
    }

    revalidatePath(`/video/${video.slug}`);

    return {
      success: true,
      message: "Like added successfully",
      likes: video.likes,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to update likes",
    };
  }
}

export async function getDeletedVideosAction() {
  try {
    await connectDB();

    const videos = await Video.find({
      isDeleted: true,
    })
      .populate("uploader", "name email")
      .lean();

    if (videos.length === 0) {
      return {
        success: false,
        message: "Videos not found",
        videos: [],
      };
    }

    return {
      success: true,
      message: "Videos fetched successfully",
      videos: JSON.parse(JSON.stringify(videos)),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to fetch videos",
      videos: [],
    };
  }
}

export async function toggleDeleteVideoAction(id: string) {
  try {
    await connectDB();

    const video = await Video.findById(id);

    if (!video) {
      return {
        success: false,
        message: "Video not found",
      };
    }

    const isDeleted = !video.isDeleted;

    await Video.findByIdAndUpdate(id, {
      isDeleted,
      deletedAt: isDeleted ? new Date() : null,
    });

    revalidatePath("/admin/videos/all");
    revalidatePath("/admin/videos/deleted");

    return {
      success: true,
      message: isDeleted
        ? "Video deleted successfully"
        : "Video restored successfully",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function toggleStatusUpdateVideoAction(id: string) {
  try {
    await connectDB();

    const video = await Video.findById(id);

    if (!video) {
      return {
        success: false,
        message: "Video not found",
      };
    }

    const status = video.status === "published" ? "unlisted" : "published";

    await Video.findByIdAndUpdate(id, {
      status,
      updatedAt: new Date(),
    });

    revalidatePath("/admin/videos/all");
    // revalidatePath("/admin/videos/");

    return {
      success: true,
      message:
        status === "published"
          ? "Video published  successfully"
          : "Video unlisted successfully",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

// search / type/ value
import { Types } from "mongoose";

export async function getVideosByFilterAction(
  type: string,
  value: string,
  page: number = 1,
  pageSize: number = VIDEO_LIMIT,
) {
  try {
    await connectDB();

    const currentPage = Number(page) || 1;

    const skip = (currentPage - 1) * pageSize;

    const fieldMap: Record<string, string> = {
      genre: "genre",
      language: "language",
      region: "region",
      category: "category",
    };

    const dbField = fieldMap[type];

    let filterId: Types.ObjectId | null = null;

    if (type === "region") {
      const region = await Region.findOne({
        name: value,
      });

      if (!region) {
        return {
          success: false,
          message: "Region not found",
          videos: [],
        };
      }
      filterId = region._id;
    }

    if (type === "language") {
      const lang = await Language.findOne({
        name: value,
      });

      if (!lang) {
        return {
          success: false,
          message: "Region not found",
          videos: [],
        };
      }
      filterId = lang._id;
    }
    if (type === "genre") {
      const gen = await Genre.findOne({
        name: value,
      });

      if (!gen) {
        return {
          success: false,
          message: "Genre not found",
          videos: [],
        };
      }
      filterId = gen._id;
    }


    if (!dbField) {
      return {
        success: false,
        message: "Invalid filter type",
        videos: [],
      };
    }

    const matchStage: any = {
      status: "published",
      isDeleted: false,
      [dbField]: filterId,
    };

    const result = await Video.aggregate([
      {
        $match: matchStage,
      },
      {
        $addFields: {
          _id: {
            $toString: "$_id",
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $facet: {
          data: [
            {
              $skip: skip,
            },
            {
              $limit: pageSize,
            },
          ],
          totalCount: [
            {
              $count: "total",
            },
          ],
        },
      },
    ]);

    const videos = result[0]?.data || [];

    const total = result[0]?.totalCount?.[0]?.total || 0;

    return {
      success: true,
      videos: structuredClone(videos),
      currentPage,
      totalPages: Math.ceil(total / pageSize),
      totalVideos: total,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      videos: [],
    };
  }
}

export async function searchVideosAction(
  keyword: string,
  page: number = 1,
  pageSize: number = VIDEO_LIMIT,
) {
  try {
    await connectDB();

    const currentPage = Number(page) || 1;

    const skip = (currentPage - 1) * pageSize;

    const search = keyword.trim();

    const matchStage: any = {
      status: "published",
    };

    if (search) {
      matchStage.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: search,
            $options: "i",
          },
        },
        {
          actors: {
            $regex: search,
            $options: "i",
          },
        },
        {
          genre: {
            $regex: search,
            $options: "i",
          },
        },
        {
          language: {
            $regex: search,
            $options: "i",
          },
        },
        {
          region: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const result = await Video.aggregate([
      {
        $match: matchStage,
      },

      {
        $addFields: {
          _id: {
            $toString: "$_id",
          },
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $facet: {
          data: [
            {
              $skip: skip,
            },
            {
              $limit: pageSize,
            },
          ],

          totalCount: [
            {
              $count: "total",
            },
          ],
        },
      },
    ]);

    const videos = result[0]?.data || [];

    const total = result[0]?.totalCount?.[0]?.total || 0;

    return {
      success: true,
      message: "Videos fetched successfully",

      videos: structuredClone(videos),

      currentPage,

      totalPages: Math.ceil(total / pageSize),

      totalVideos: total,

      pageSize,

      keyword,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to search videos",

      videos: [],

      currentPage: 1,

      totalPages: 0,

      totalVideos: 0,

      pageSize,

      keyword,
    };
  }
}

import Region from "@/models/region.model";
import Genre from "@/models/genre.model";
import Language from "@/models/language.model";

export async function getSearchTypeValuesAction(type: string) {
  try {
    await connectDB();

    switch (type) {
      case "genre":
        return await Genre.find({}).lean();

      case "language":
        return await Language.find({}).lean();

      case "region":
        return await Region.find({}).lean();

      default:
        return [];
    }
  } catch (error) {
    console.error(error);

    return {
      success: false,
      items: [],
    };
  }
}


export async function updateVideoViewsAction(slug: string) {
  try {
    await connectDB();
    await Video.findOneAndUpdate(
      { slug, isDeleted: false },
      { $inc: { views: 1 } }
    );
    return { success: true };
  } catch (error) {
    console.error("updateVideoViewsAction error:", error);
    return { success: false };
  }
}

export async function updateVideoLikesAction(
  slug: string,
  action: "like" | "unlike"
) {
  try {
    await connectDB();

    const video = await Video.findOneAndUpdate(
      {
        slug,
        isDeleted: false,
        ...(action === "unlike" ? { likes: { $gt: 0 } } : {}),
      },
      { $inc: { likes: action === "like" ? 1 : -1 } },
      { new: true, select: "likes" }
    );

    if (!video) return { success: false, likes: 0 };

    return { success: true, likes: video.likes };
  } catch (error) {
    console.error("updateVideoLikesAction error:", error);
    return { success: false, likes: 0 };
  }
}
