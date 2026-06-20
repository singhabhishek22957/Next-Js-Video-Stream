export const revalidate = 300;
import VideoGrid from "@/components/video/videoGrid";
import { getAllVideosAction } from "@/features/video/actions/video.action";
import { Metadata } from "next";
import Link from "next/link";
interface VideosPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}
export const metadata: Metadata = {
  title: `Latest Videos | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description:
    "Watch the latest uploaded videos, trending content and popular videos.",

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/videos`,
  },

  openGraph: {
    title: `Latest Videos | ${process.env.NEXT_PUBLIC_APP_NAME}`,
    description:
      "Watch the latest uploaded videos, trending content and popular videos.",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/videos`,
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;

  const result = await getAllVideosAction(currentPage);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Latest Videos",
    description:
      "Watch the latest uploaded videos, trending content and popular videos.",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/videos`,
    numberOfItems: result.totalVideos,
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent px-4 py-10 md:px-8 md:py-14">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Latest Videos
          </h1>

          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            Discover the latest uploaded videos, trending content, popular
            videos and newly released entertainment.
          </p>

          <div className="mt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium">
              <span className="text-primary font-bold">
                {result.totalVideos}
              </span>
              <span className="text-muted-foreground">videos available</span>
            </span>
          </div>
        </div>
      </div>

      {/* Videos */}
      <div className="max-w-[1600px] mx-auto px-4 py-8 md:px-8 md:py-10">
        <VideoGrid
          videos={result.videos}
          title="Latest and Trending Videos"
          subtitle={`Page ${currentPage} of ${result.totalPages}`}
          emptyMessage="No videos found"
          emptySubMessage="Check back soon for new content."
        />

        {/* Pagination */}
        {result.totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
            {currentPage > 1 && (
              <Link
                href={`?page=${currentPage - 1}`}
                className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm hover:bg-white/10 transition-colors"
              >
                ← Prev
              </Link>
            )}

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
                    key={`ellipsis-${pageNo}`}
                    className="px-2 text-muted-foreground text-sm"
                  >
                    ...
                  </span>
                );
              }

              if (!show) return null;

              return (
                <Link
                  key={pageNo}
                  href={`?page=${pageNo}`}
                  className={
                    "min-w-[36px] h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors duration-200 " +
                    (isActive
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/25"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground")
                  }
                >
                  {pageNo}
                </Link>
              );
            })}

            {currentPage < result.totalPages && (
              <Link
                href={`?page=${currentPage + 1}`}
                className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm hover:bg-white/10 transition-colors"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />
    </div>
  );
}
