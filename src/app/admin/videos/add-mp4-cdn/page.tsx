import { getFilterData } from "@/features/cacheData/actions/genreLangRegionData.action";

import AddVideoFormMp4Cdn from "@/components/video/addVideoFormMp4Cdn";

export default async function Page() {
  const data = await getFilterData();

  return (
    <AddVideoFormMp4Cdn
      genres={data.genres}
      regions={data.regions}
      languages={data.languages}
    />
  );
}