
import SearchBreadcrumb from "@/components/searchBreadcrumb";
import VideoGrid from "@/components/video/videoGrid";
import { searchVideosAction } from "@/features/video/actions/video.action";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

/* Build search URL outside JSX — avoids template literal parse errors */
function searchUrl(keyword: string, pageNo: number): string {
  return "/search?q=" + encodeURIComponent(keyword) + "&page=" + pageNo;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", page = "1" } = await searchParams;

  const keyword = q.trim();
  const currentPage = Number(page) || 1;

  /* ── Empty query state ── */
  if (!keyword) {
    return (
      <div className="min-h-screen">
        {/* Hero */}
        <div className="relative border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent px-4 py-10 md:px-8 md:py-14">
          <div className="max-w-[1600px] mx-auto">
            <SearchBreadcrumb />
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Search
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Find anything
              </h1>
              <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-md">
                Search across videos, genres, languages, regions, actors, tags and more.
              </p>
            </div>
          </div>
        </div>

        {/* Empty prompt */}
        <div className="max-w-[1600px] mx-auto px-4 py-16 md:px-8 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl">
            🔍
          </div>
          <h2 className="text-lg font-semibold">Start searching</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Type a keyword in the search bar above to discover videos.
          </p>
        </div>
      </div>
    );
  }

  const result = await searchVideosAction(keyword, currentPage);
  const hasVideos = result.videos.length > 0;

  /* Pre-build pagination URLs */
  const prevUrl = searchUrl(keyword, currentPage - 1);
  const nextUrl = searchUrl(keyword, currentPage + 1);

  return (
    <div className="min-h-screen">
      {/* ── Hero header ── */}
      <div className="relative border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent px-4 py-10 md:px-8 md:py-14">
        <div className="max-w-[1600px] mx-auto">
          <SearchBreadcrumb />

          <div className="mt-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Search Results
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                "{keyword}"
              </h1>
              <p className="mt-3 text-sm md:text-base text-muted-foreground">
                {hasVideos
                  ? "Showing results for your search query."
                  : "No results found for this keyword."}
              </p>
            </div>

            {/* Count badge */}
            <div className="mt-4 sm:mt-0 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium">
                <span className="text-primary font-bold">{result.totalVideos}</span>
                <span className="text-muted-foreground">videos found</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-[1600px] mx-auto px-4 py-8 md:px-8 md:py-10">
        {hasVideos ? (
          <>
            {/* Section divider */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                All Results
              </span>
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {result.totalPages}
              </span>
            </div>

            {/* ── VideoGrid replaces the raw grid div ── */}
            <VideoGrid videos={result.videos} />

            {/* ── Pagination ── */}
            {result.totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">

                {/* Prev */}
                {currentPage > 1 && (
                  <a
                    href={prevUrl}
                    className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm hover:bg-white/10 transition-colors"
                  >
                    ← Prev
                  </a>
                )}

                {/* Page numbers with ellipsis */}
                {Array.from({ length: result.totalPages }).map((_, index) => {
                  const pageNo = index + 1;
                  const isActive = pageNo === currentPage;

                  const show =
                    pageNo === 1 ||
                    pageNo === result.totalPages ||
                    Math.abs(pageNo - currentPage) <= 1;

                  const showEllipsisBefore =
                    pageNo === currentPage - 2 && currentPage > 3;
                  const showEllipsisAfter =
                    pageNo === currentPage + 2 &&
                    currentPage < result.totalPages - 2;

                  if (showEllipsisBefore || showEllipsisAfter) {
                    return (
                      <span
                        key={"ellipsis-" + pageNo}
                        className="px-2 text-muted-foreground text-sm"
                      >
                        …
                      </span>
                    );
                  }

                  if (!show) return null;

                  const pageUrl = searchUrl(keyword, pageNo);
                  const activeClass = "bg-primary border-primary text-white shadow-lg shadow-primary/25";
                  const inactiveClass = "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground";

                  return (
                    <a
                      key={pageNo}
                      href={pageUrl}
                      className={"min-w-[36px] h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors duration-200 " + (isActive ? activeClass : inactiveClass)}
                    >
                      {pageNo}
                    </a>
                  );
                })}

                {/* Next */}
                {currentPage < result.totalPages && (
                  <a
                    href={nextUrl}
                    className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm hover:bg-white/10 transition-colors"
                  >
                    Next →
                  </a>
                )}
              </div>
            )}
          </>
        ) : (
          <VideoGrid
            videos={[]}
            emptyMessage="No videos found"
            emptySubMessage={"No results for \"" + keyword + "\". Try a different keyword."}
          />
        )}
      </div>
    </div>
  );
}