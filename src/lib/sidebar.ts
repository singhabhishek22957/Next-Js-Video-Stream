import "server-only";


import { SidebarMenuItem } from "@/types/sidebar";

import { getFilterData } from "@/features/cacheData/actions/genreLangRegionData.action";

export async function getPublicSidebarMenuItems(): Promise<SidebarMenuItem[]> {
  const {
    genres,
    regions,
    languages,
  } = await getFilterData();

  return [
    {
      label: "Home",
      icon: "home",
      path: "/",
    },

    {
      label: "Region",
      icon: 'map',
      children: regions.map(
        (region: any) => ({
          label: region.name,
          path: `/search/region/${region.name}`,
        })
      ),
    },

    {
      label: "Genre",
      icon: 'video',
      children: genres.map(
        (genre: any) => ({
          label: genre.name,
          path: `/search/genre/${genre.name}`,
        })
      ),
    },

    {
      label: "Language",
      icon: 'language',
      children: languages.map(
        (language: any) => ({
          label: language.name,
          path: `/search/language/${language.name}`,
        })
      ),
    },
  ];
}