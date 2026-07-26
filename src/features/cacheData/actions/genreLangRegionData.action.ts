import "server-only";

import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";

import Genre from "@/models/genre.model";
import Region from "@/models/region.model";
import Language from "@/models/language.model";


export const getGenres = unstable_cache(
  async () => {
    await connectDB();
    return Genre.find({ isActive: true }).select("name slug").lean();
  },
  ["genres"],
  {
    tags: ["genres"],
    revalidate: 3600,
  }
);

export const getRegions = unstable_cache(
  async () => {
    await connectDB();
    return Region.find({ isActive: true }).select("name code").lean();
  },
  ["regions"],
  {
    tags: ["regions"],
    revalidate: 3600,
  }
);

export const getLanguages = unstable_cache(
  async () => {
    await connectDB();
    return Language.find({ isActive: true }).select("name code").lean();
  },
  ["languages"],
  {
    tags: ["languages"],
    revalidate: 3600,
  }
);

export async function getFilterData() {
  const [genres, regions, languages] = await Promise.all([
    getGenres(),
    getRegions(),
    getLanguages(),
  ]);

  return {
    genres: JSON.parse(JSON.stringify(genres)),
    regions: JSON.parse(JSON.stringify(regions)),
    languages: JSON.parse(JSON.stringify(languages)),
  };
}


