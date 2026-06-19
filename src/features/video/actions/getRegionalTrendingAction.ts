"use server";

import { connectDB } from "@/lib/db";
import { Video } from "@/models/video.model";
import { Types } from "mongoose";

interface Params {
  slug: string;
  region?: string;
  language?: string;
  page?: number;
  limit?: number;
}

export async function getRegionalTrendingAction({
  slug,
  region,
  language,
  page = 1,
  limit = 10,
}: Params) {
  try {
    await connectDB();

    if (!region && !language) {
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
    if (region) matchOr.push({ region: new Types.ObjectId(region) });
    if (language) matchOr.push({ language: new Types.ObjectId(language) });

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
                $cond: [
                  region
                    ? { $eq: ["$region", new Types.ObjectId(region)] }
                    : false,
                  30,
                  0,
                ],
              },
              {
                $cond: [
                  language
                    ? { $eq: ["$language", new Types.ObjectId(language)] }
                    : false,
                  20,
                  0,
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
    console.error("getRegionalTrendingAction error:", error);
    return {
      success: false,
      videos: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
    };
  }
}
