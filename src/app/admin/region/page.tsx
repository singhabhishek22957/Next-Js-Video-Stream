import {
  getAllRegionsAction,
} from "@/features/region/actions/region.action";

import RegionManager from "@/components/region/regionManager";

export default async function RegionsPage() {
  const result =
    await getAllRegionsAction();

  return (
    <div className="p-6">
      <RegionManager
        regions={
          result.regions || []
        }
      />
    </div>
  );
}
