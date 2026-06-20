import SearchBreadcrumb from "@/components/searchBreadcrumb";
import VideoGrid from "@/components/video/videoGrid";
import { getVideosByFilterAction } from "@/features/video/actions/video.action";
import { Metadata } from "next";

interface SearchValuePageProps {
  params: Promise<{
    type: string;
    value: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    type: string;
    value: string;
  }>;
}): Promise<Metadata> {
  const { type, value } = await params;

  const title = `${value} ${type} Videos | ${process.env.NEXT_PUBLIC_APP_NAME}`;

  const description = `Watch ${value} ${type} videos online. Explore trending, popular and latest videos in ${value}.`;

  return {
    title,
    description,

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/search/${type}/${value}`,
    },

    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/search/${type}/${value}`,
      type: "website",
      siteName: process.env.NEXT_PUBLIC_APP_NAME,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SearchValuePage({
  params,
  searchParams,
}: SearchValuePageProps) {
  const { type, value } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const result = await getVideosByFilterAction(type, value, currentPage);

  const hasVideos = result.videos.length > 0;
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${value} ${type} Videos`,
    description: `Browse videos filtered by ${type}: ${value}`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/search/${type}/${value}`,
  };

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <div className="relative border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent px-4 py-10 md:px-8 md:py-14">
        <div className="max-w-[1600px] mx-auto">
          <SearchBreadcrumb type={type} value={value} />

          <div className="mt-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                {type}
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight capitalize">
                {value} {type} Videos
              </h1>
              <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
                Watch the latest {value} {type} videos online. Discover
                trending, popular and recently uploaded videos related to{" "}
                {value}.
              </p>
            </div>

            {/* Count badge */}
            <div className="mt-4 sm:mt-0 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium">
                <span className="text-primary font-bold">
                  {result.totalVideos}
                </span>
                <span className="text-muted-foreground">videos found</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-8 md:px-8 md:py-10">
        {hasVideos ? (
          <>
            <VideoGrid
              videos={result.videos}
              title="All Videos"
              subtitle={`Page ${currentPage} of ${result.totalPages}`}
            />

            {result.totalPages && result.totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                {/* pagination code */}
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <VideoGrid
            videos={[]}
            emptyMessage="No videos found"
            emptySubMessage={`There are no videos matching ${value} in ${type} yet. Check back soon.`}
          />
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
