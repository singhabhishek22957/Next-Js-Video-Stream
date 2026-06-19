import "server-only";

import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";

import Genre from "@/models/genre.model";
import Region from "@/models/region.model";
import Language from "@/models/language.model";

export const getFilterData =
  unstable_cache(
    async () => {
      await connectDB();

      const [
        genres,
        regions,
        languages,
      ] = await Promise.all([
        Genre.find({ isActive: true })
          .select("name slug")
          .lean(),

        Region.find({ isActive: true })
          .select("name code")
          .lean(),

        Language.find({ isActive: true })
          .select("name code")
          .lean(),
      ]);

      return {
        genres: JSON.parse(JSON.stringify(genres)),
        regions: JSON.parse(JSON.stringify(regions)),
        languages: JSON.parse(JSON.stringify(languages)),
      };
    },
    ["filter-data"],
    {
      revalidate: 3600,
    }
  );