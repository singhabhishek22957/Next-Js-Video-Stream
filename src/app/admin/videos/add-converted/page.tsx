import { getFilterData } from "@/features/cacheData/actions/genreLangRegionData.action";
import AddVideoForm from "@/components/video/addVideoForm";

export default async function Page() {
  const data = await getFilterData();

  return (
    <AddVideoForm
      genres={data.genres}
      regions={data.regions}
      languages={data.languages}
    />
  );
}