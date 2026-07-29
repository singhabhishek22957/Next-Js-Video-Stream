import VideoGrid from "@/components/video/videoGrid";
import { getAllVideosAction } from "@/features/video/actions/video.action";
import { Home } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 300;
interface HomePageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description:
    "Watch trending videos, latest uploads, popular entertainment, movies and more.",

  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },

  openGraph: {
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description:
      "Watch trending videos, latest uploads, popular entertainment, movies and more.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    type: "website",
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;

  const result = await getAllVideosAction(currentPage);
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: process.env.NEXT_PUBLIC_APP_NAME,
    url: process.env.NEXT_PUBLIC_APP_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative border-b border-border bg-gradient-to-b from-secondary/50 to-background px-4 py-10 md:px-8 md:py-14">
        <div className="max-w-[1600px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
            <Home size={16} />
          </p>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Latest, Trending & Popular Videos
          </h1>

          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            Discover trending videos, latest uploads, popular entertainment,
            movies and newly released content from creators worldwide.
          </p>

          {/* <div className="mt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium shadow-sm">
              <span className="text-primary font-bold">
                {result.totalVideos}
              </span>
              <span className="text-muted-foreground">videos available</span>
            </span>
          </div> */}
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
                className="px-3 py-2 rounded-xl border border-border bg-card text-sm hover:bg-secondary transition-colors"
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
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground")
                  }
                >
                  {pageNo}
                </Link>
              );
            })}

            {currentPage < result.totalPages && (
              <Link
                href={`?page=${currentPage + 1}`}
                className="px-3 py-2 rounded-xl border border-border bg-card text-sm hover:bg-secondary transition-colors"
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
          __html: JSON.stringify(homeSchema),
        }}
      />
    </div>
  );
}
