export const revalidate = 3600;
import { notFound } from "next/navigation";

import SearchBreadcrumb from "@/components/searchBreadcrumb";
import CategoryCard from "@/components/categoryCard";

import { getSearchTypeValuesAction } from "@/features/video/actions/video.action";
import { Metadata } from "next";

interface SearchTypePageProps {
  params: Promise<{
    type: string;
  }>;
}

const titleMap: Record<string, string> = {
  genre: "Genres",
  language: "Languages",
  region: "Regions",
};

const subtitleMap: Record<string, string> = {
  genre: "Pick a genre and dive into a world of stories.",
  language: "Explore content from around the world in any language.",
  region: "Discover films and shows from every corner of the globe.",
};

const allowedTypes = ["genre", "language", "region"];
export async function generateMetadata({
  params,
}: SearchTypePageProps): Promise<Metadata> {
  const { type } = await params;

  return {
    title: `${titleMap[type]} | ${process.env.NEXT_PUBLIC_APP_NAME}`,
    description: subtitleMap[type],

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/search/${type}`,
    },

    openGraph: {
      title: `${titleMap[type]} | ${process.env.NEXT_PUBLIC_APP_NAME}`,
      description: subtitleMap[type],
      url: `${process.env.NEXT_PUBLIC_APP_URL}/search/${type}`,
      type: "website",
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SearchTypePage({ params }: SearchTypePageProps) {
  const { type } = await params;

  if (!allowedTypes.includes(type)) {
    notFound();
  }

  const data = await getSearchTypeValuesAction(type);
  const items = Array.isArray(data) ? data : [];
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: titleMap[type],
    description: subtitleMap[type],
    url: `${process.env.NEXT_PUBLIC_APP_URL}/search/${type}`,
    numberOfItems: items.length,
  };

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <div className="relative border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent px-4 py-10 md:px-8 md:py-14">
        <div className="max-w-[1600px] mx-auto">
          <SearchBreadcrumb type={type} />

          <div className="mt-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Browse {titleMap[type]}
              </h1>
              <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
                Explore all available {titleMap[type].toLowerCase()} and
                discover trending videos, popular content and newly uploaded
                videos.
              </p>
            </div>

            {/* Count badge */}
            <div className="mt-4 sm:mt-0 flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium">
                <span className="text-primary font-bold">{items.length}</span>
                <span className="text-muted-foreground">
                  {titleMap[type].toLowerCase()} available
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid section */}
      <div className="max-w-[1600px] mx-auto px-4 py-8 md:px-8 md:py-10">
        {items.length > 0 ? (
          <>
            {/* Divider label */}

            <div className="flex-1 mt-14 h-px bg-white/5"></div>

            <div
              className="
              mt-10
                grid
                gap-4
                md:gap-5

                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                2xl:grid-cols-5
              "
            >
              {items.map((item: any) => (
                <CategoryCard
                  key={item._id}
                  type={type}
                  value={item.slug ?? item.name}
                  thumbnailUrl={item.thumbnailUrl}
                />
              ))}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-28 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl">
              🎬
            </div>
            <h3 className="text-lg font-semibold">Nothing here yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              No {titleMap[type].toLowerCase()} have been added yet. Check back
              soon.
            </p>
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
