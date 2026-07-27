import { getFilterData } from "@/features/cacheData/actions/genreLangRegionData.action";

import AddVideoFormMp4 from "@/components/video/addVideoFormMp4";

export default async function Page() {
  const data = await getFilterData();

  return (
    <AddVideoFormMp4
      genres={data.genres}
      regions={data.regions}
      languages={data.languages}
    />
  );
}