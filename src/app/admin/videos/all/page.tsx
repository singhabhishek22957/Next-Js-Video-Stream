import { getAllVideosAction } from "@/features/video/actions/video.action";
import VideosTable from "@/components/video/videoTable";

interface Props {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>;
}

export default async function AllVideosPage({
  searchParams,
}: Props) {
  const params =
    await searchParams;

  const page =
    Number(params.page) || 1;

  const pageSize =
    Number(
      params.pageSize
    ) || 15;

  const search =
    params.search || "";

  const sortBy =
    params.sortBy ||
    "updatedAt";

  const sortOrder =
    params.sortOrder ||
    "desc";

  const result =
    await getAllVideosAction(
      page,
      pageSize,
      search,
      sortBy,
      sortOrder
    );

  return (
    <div className="p-6">
      <VideosTable
        videos={result.videos}
        currentPage={
          result.currentPage
        }
        totalPages={
          result.totalPages
        }
        pageSize={
          result.pageSize
        }
        search={
          result.search
        }
        sortBy={
          result.sortBy
        }
        sortOrder={
          result.sortOrder
        }
      />
    </div>
  );
}