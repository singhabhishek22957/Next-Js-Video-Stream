import Link from "next/link";
import Image from "next/image";
import { getRegionalTrendingAction } from "@/features/video/actions/getRegionalTrendingAction";
import VideoCard from "./videoCard";

interface Props {
  slug: string;
  region?: any;
  language?: any;
  currentPage: number;
}

export default async function RegionalSidebar({
  slug,
  region,
  language,
  currentPage,
}: Props) {
  const result = await getRegionalTrendingAction({
    slug,
    region: region?._id?.toString(),
    language: language?._id?.toString(),
    page: currentPage,
    limit: 10,
  });

  if (!result.success || result.videos.length === 0) return null;

  const buildUrl = (page: number) => `?rPage=${page}`;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Trending in your region
          </p>
          <p className="text-sm font-semibold mt-0.5">
            {region?.name ?? ""}
            {region?.name && language?.name ? " · " : ""}
            {language?.name ?? ""}
          </p>
        </div>
        <span className="rounded-full bg-surface border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
          {result.total}
        </span>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-thin scrollbar-thumb-border">
        {result.videos.map((video: any, i: number) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-border flex-shrink-0">
          <Link
            href={buildUrl(currentPage - 1)}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-border transition-colors
              ${currentPage <= 1
                ? "pointer-events-none opacity-30"
                : "hover:bg-surface"
              }`}
            aria-disabled={currentPage <= 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Prev
          </Link>
          <span className="text-[11px] text-muted-foreground">
            {currentPage} / {result.totalPages}
          </span>
          <Link
            href={buildUrl(currentPage + 1)}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-border transition-colors
              ${currentPage >= result.totalPages
                ? "pointer-events-none opacity-30"
                : "hover:bg-surface"
              }`}
            aria-disabled={currentPage >= result.totalPages}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </Link>
        </div>
      )}
    </div>
  );
}