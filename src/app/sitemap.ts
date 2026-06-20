import { MetadataRoute } from "next";
import {connectDB} from "@/lib/db";
import { Video } from "@/models/video.model";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const videos = await Video.find({})
    .select("slug updatedAt")
    .lean();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const videoUrls = videos.map((video: any) => ({
    url: `${baseUrl}/videos/${video.slug}`,
    lastModified: video.updatedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },

    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      priority: 0.9,
    },

    ...videoUrls,
  ];
}