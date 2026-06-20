import { notFound } from "next/navigation";
import VideoPlayer from "@/components/video/videojs-player";
import DescriptionToggle from "@/components/video/descriptionToggle";
import RegionalSidebar from "@/components/video/regionalSidebar";
import ActorGenreGrid from "@/components/video/actorGenreGrid";
import { getVideoBySlugAction } from "@/features/video/actions/video.action";
import LikeButton from "@/components/video/likeButton";
import ShareButton from "@/components/video/shareButton";
import VideoViewTracker from "@/components/video/videoViewTracker";
import { Suspense } from "react";
import type { Metadata } from "next";
  import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ rPage?: string; agPage?: string }>;
}

function timeAgo(date: Date | string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1)
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}

function cleanTag(tag: string) {
  return tag.startsWith("#") ? tag.slice(1) : tag;
}
function toISO8601Duration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s}S`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const result = await getVideoBySlugAction(slug);

  if (!result.success || !result.video) {
    return {
      title: "Video Not Found",
    };
  }

  const video = result.video;

  return {
    title: `${video.title} | ${process.env.NEXT_PUBLIC_APP_NAME}`,
    description: video.description?.trim() || `Watch ${video.title} online.`,

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/videos/${video.slug}`,
    },

    openGraph: {
      title: `${video.title} | ${process.env.NEXT_PUBLIC_APP_NAME}`,
      description: video.description?.trim() || `Watch ${video.title} online.`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/videos/${video.slug}`,
      images: [
        {
          url: video.thumbnailUrl,
          width: 1280,
          height: 720,
          alt: video.title,
        },
      ],
      type: "video.other",
      siteName: process.env.NEXT_PUBLIC_APP_NAME,
    },

    twitter: {
      card: "summary_large_image",
      title: `${video.title} | ${process.env.NEXT_PUBLIC_APP_NAME}`,
      description: video.description?.trim() || `Watch ${video.title} online.`,
      images: [video.thumbnailUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
    keywords: [
      video.title,
      ...(video.actors ?? []),
      ...(video.genre?.map((g: any) => g.name) ?? []),
      video.language?.name,
      video.region?.name,
    ].filter(Boolean),
  };
}

export default async function VideoPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { rPage, agPage } = await searchParams;

  const regionalPage = Math.max(1, parseInt(rPage ?? "1", 10));
  const actorGenrePage = Math.max(1, parseInt(agPage ?? "1", 10));

  const result = await getVideoBySlugAction(slug);
  if (!result.success || !result.video) notFound();

  const video = result.video;



  const metadata = [
    {
      label: "Genre",
      value: (
        <div className="flex flex-wrap gap-2">
          {video.genre?.map((g: any) => (
            <Link
              key={g.slug}
              href={`/search/genre/${g.name}`}
              className="text-primary hover:underline"
            >
              {g.name}
            </Link>
          ))}
        </div>
      ),
    },

    {
      label: "Language",
      value: (
        <Link
          href={`/search/language/${video.language.name}`}
          className="text-primary hover:underline"
        >
          {video.language.name}
        </Link>
      ),
    },

    {
      label: "Region",
      value: (
        <Link
          href={`/search/region/${video.region.name}`}
          className="text-primary hover:underline"
        >
          {video.region.name}
        </Link>
      ),
    },
  ];

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description || video.title,
    thumbnailUrl: [video.thumbnailUrl],
    uploadDate: video.createdAt,
    duration: toISO8601Duration(video.duration),
    contentUrl: video.videoUrl,
    embedUrl: `${process.env.NEXT_PUBLIC_APP_URL}/videos/${video.slug}`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/videos/${video.slug}`,
    publisher: {
      "@type": "Organization",
      name: `${process.env.NEXT_PUBLIC_APP_NAME}`,
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_LOGO_URL}`,
      },
    },
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: {
        "@type": "WatchAction",
      },
      userInteractionCount: video.views,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_APP_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Videos",
        item: `${process.env.NEXT_PUBLIC_APP_URL}/videos`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: video.title,
        item: `${process.env.NEXT_PUBLIC_APP_URL}/videos/${video.slug}`,
      },
    ],
  };

  const cleanedTags = (video.tags ?? []).map(cleanTag);

  return (
    <main className="mx-auto max-w-[1600px] px-3 md:px-5 xl:px-6 py-4">
      <div className="flex flex-col xl:flex-row gap-5">
        {/* ── LEFT ── */}
        <section className="flex-1 min-w-0 flex flex-col gap-4">
          {/* PLAYER */}
          <div className="overflow-hidden rounded-2xl border border-border bg-black">
            <div className="aspect-video">
              <VideoPlayer
                src={video.videoUrl}
                poster={video.thumbnailUrl}
                autoplay
              />
            </div>
          </div>
          {/* TITLE */}
          <h1 className="text-xl sm:text-2xl font-bold leading-tight">
            {video.title}
          </h1>
          {/* META PILLS */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {video.views?.toLocaleString()} views
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {video.likes?.toLocaleString()} likes
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {timeAgo(video.createdAt)}
            </span>
          </div>
          {/* ACTIONS */}
          <div className="flex gap-2">
            <LikeButton slug={video.slug} initialLikes={video.likes ?? 0} />
            <ShareButton title={video.title} />
          </div>
          <hr className="border-border" />
          {/* VIEW TRACKER — invisible, fires after threshold */}
          <VideoViewTracker slug={video.slug} duration={video.duration ?? 0} />
          {/* COLLAPSIBLE DESCRIPTION */}
          <DescriptionToggle
            description={video.description ?? ""}
            metadata={metadata}
            tags={cleanedTags}
          />
          {/* ACTOR / GENRE GRID — below player */}

          <Suspense fallback={<GridSkeleton />}>
            <ActorGenreGrid
              slug={video.slug}
              actors={video.actors}
              genre={video.genre}
              currentPage={actorGenrePage}
            />
          </Suspense>
        </section>

        {/* ── RIGHT SIDEBAR — regional trending ── */}
        <aside className="hidden xl:flex xl:w-[300px] xl:shrink-0 xl:sticky xl:top-20 xl:self-start xl:h-[calc(100vh-6rem)] flex-col rounded-2xl border border-border overflow-hidden">
          <Suspense fallback={<SidebarSkeleton />}>
            <RegionalSidebar
              slug={video.slug}
              region={video.region}
              language={video.language}
              currentPage={regionalPage}
            />
          </Suspense>
        </aside>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </main>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border flex-shrink-0">
        <div className="h-3 w-24 rounded bg-surface animate-pulse mb-1.5" />
        <div className="h-4 w-32 rounded bg-surface animate-pulse" />
      </div>
      <div className="flex-1 p-2 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-2.5 p-2">
            <div className="w-[88px] h-[50px] rounded-md bg-surface animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-1.5 pt-1">
              <div className="h-3 w-full rounded bg-surface animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-surface animate-pulse" />
              <div className="h-2.5 w-1/2 rounded bg-surface animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="mt-6">
      <div className="mb-5 space-y-1.5">
        <div className="h-2.5 w-20 rounded bg-surface animate-pulse" />
        <div className="h-5 w-36 rounded bg-surface animate-pulse" />
        <div className="h-3 w-48 rounded bg-surface animate-pulse" />
      </div>
      <div className="ag-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border overflow-hidden"
          >
            <div className="aspect-video bg-surface animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-3 w-full rounded bg-surface animate-pulse" />
              <div className="h-3 w-3/4 rounded bg-surface animate-pulse" />
              <div className="h-2.5 w-1/2 rounded bg-surface animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
