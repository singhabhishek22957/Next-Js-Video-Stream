import Link from "next/link";
import Image from "next/image";
import { getActorGenreTrendingAction } from "@/features/video/actions/getActorGenreTrendingAction";
import VideoCard from "./videoCard";

interface Props {
  slug: string;
  actors?: string[];
  genre?: any[];
  currentPage: number;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatViews(views: number) {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(0)}K`;
  return views.toString();
}

export default async function ActorGenreGrid({
  slug,
  actors = [],
  genre = [],
  currentPage,
}: Props) {
  const genreIds = genre.map((g: any) => g._id?.toString()).filter(Boolean);

  const result = await getActorGenreTrendingAction({
    slug,
    actors,
    genreIds,
    page: currentPage,
    limit: 20,
  });

  if (!result.success || result.videos.length === 0) return null;

  const buildUrl = (page: number) => `?agPage=${page}`;

  return (
    <section className="mt-6">
      {/* Header */}
      <div className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1">
          Trending this week
        </p>
        <h2 className="text-lg font-bold">More like this</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {result.total} videos · based on actors &amp; genre
        </p>
      </div>

      {/* Grid */}
      <style>{`
        .ag-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (min-width: 640px) {
          .ag-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        }
        @media (min-width: 768px) {
          .ag-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        }
        @media (min-width: 1024px) {
          .ag-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        }
        @media (min-width: 1280px) {
          .ag-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
        }
        @media (min-width: 1536px) {
          .ag-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
        }
      `}</style>

      <div className="ag-grid">
        {result.videos.map((video: any) => (

          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-1.5">
          <Link
            href={buildUrl(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm transition-colors
              ${currentPage <= 1
                ? "pointer-events-none opacity-30"
                : "hover:bg-surface"
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>

          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildUrl(p)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-medium transition-colors
                ${p === currentPage
                  ? "border-border bg-surface font-semibold"
                  : "border-border bg-background hover:bg-surface"
                }`}
            >
              {p}
            </Link>
          ))}

          <Link
            href={buildUrl(currentPage + 1)}
            aria-disabled={currentPage >= result.totalPages}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm transition-colors
              ${currentPage >= result.totalPages
                ? "pointer-events-none opacity-30"
                : "hover:bg-surface"
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </Link>
        </div>
      )}
    </section>
  );
}