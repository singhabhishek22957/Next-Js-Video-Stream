"use server";

import { connectDB } from "@/lib/db";
import { Video } from "@/models/video.model";
import { Types } from "mongoose";

interface Params {
  slug: string;
  actors?: string[];
  genreIds?: string[];
  page?: number;
  limit?: number;
}

export async function getActorGenreTrendingAction({
  slug,
  actors = [],
  genreIds = [],
  page = 1,
  limit = 20,
}: Params) {
  try {
    await connectDB();

    if (!actors.length && !genreIds.length) {
      return {
        success: false,
        videos: [],
        total: 0,
        totalPages: 0,
        currentPage: page,
      };
    }

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const skip = (page - 1) * limit;

    const matchOr: any[] = [];
    if (actors.length) matchOr.push({ actors: { $in: actors } });
    if (genreIds.length) {
      matchOr.push({
        genre: { $in: genreIds.map((id) => new Types.ObjectId(id)) },
      });
    }

    const pipeline: any[] = [
      {
        $match: {
          isDeleted: false,
          status: "published",
          slug: { $ne: slug },
          createdAt: { $gte: oneWeekAgo },
          $or: matchOr,
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              {
                $multiply: [
                  {
                    $size: {
                      $setIntersection: [{ $ifNull: ["$actors", []] }, actors],
                    },
                  },
                  100,
                ],
              },
              {
                $multiply: [
                  {
                    $size: {
                      $setIntersection: [
                        { $ifNull: ["$genre", []] },
                        genreIds.map((id) => new Types.ObjectId(id)),
                      ],
                    },
                  },
                  50,
                ],
              },
            ],
          },
        },
      },
      {
        $sort: { score: -1, views: -1, createdAt: -1 },
      },
      {
        $lookup: {
          from: "genres",
          localField: "genre",
          foreignField: "_id",
          as: "genre",
        },
      },
      {
        $lookup: {
          from: "regions",
          localField: "region",
          foreignField: "_id",
          as: "region",
        },
      },
      { $unwind: { path: "$region", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "languages",
          localField: "language",
          foreignField: "_id",
          as: "language",
        },
      },
      { $unwind: { path: "$language", preserveNullAndEmptyArrays: true } },
      {
        $facet: {
          videos: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Video.aggregate(pipeline);
    const videos = JSON.parse(JSON.stringify(result?.[0]?.videos || []));
    const total = result?.[0]?.totalCount?.[0]?.count || 0;

    return {
      success: true,
      videos,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("getActorGenreTrendingAction error:", error);
    return {
      success: false,
      videos: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
    };
  }
}
