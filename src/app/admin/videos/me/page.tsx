import {  getAllVideosByUploaderAction } from "@/features/video/actions/video.action";
import VideosTable from "@/components/video/videoTable";
import { auth} from '@/auth';

interface Props {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    id?: string;
  }>;
}

export default async function AllVideoMePage({ searchParams }: Props) {
 
     const session = await auth();
     const user = session?.user;

  const params = await searchParams;

  const page = Number(params.page) || 1;

  const pageSize = Number(params.pageSize) || 15;

  const search = params.search || "";

  const sortBy = params.sortBy || "updatedAt";

  const sortOrder = params.sortOrder || "desc";

  if(!user){
    return (
      <div className="p-6">
        <h1 className=" text-2xl text-primary text-center font-bold  m-2">
          You are not logged in
        </h1>
      </div>
    );

    
  }
  const id: string  = user?.id;
  const result = await getAllVideosByUploaderAction(
    page,
    pageSize,
    search,
    sortBy,
    sortOrder,
    id
  );

  return (
    <div className="p-6">
      <div className=" m-4">
        <h1 className=" text-2xl text-primary text-center font-bold "> Your Uploaded Videos </h1>
      </div>
      <VideosTable
        videos={result.videos}
        currentPage={result.currentPage}
        totalPages={result.totalPages}
        pageSize={result.pageSize}
        search={result.search}
        sortBy={result.sortBy}
        sortOrder={result.sortOrder}
      />
    </div>
  );
}
