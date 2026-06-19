

"use client";

import VideoCard from "@/components/video/videoCard";

interface Video {
  _id: string;
  slug: string;
  title: string;
  thumbnailUrl: string;
  previewVideoUrl?: string;
  duration: number;
  views: number;
  likes: number;
  createdAt: string;
}

interface VideoGridProps {
  videos: Video[];
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  emptySubMessage?: string;
}

export default function VideoGrid({
  videos,
  title,
  subtitle,
  emptyMessage = "No videos found",
  emptySubMessage = "Check back soon for new content.",
}: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl">
          🎬
        </div>
        <h3 className="text-base font-semibold">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">{emptySubMessage}</p>
      </div>
    );
  }

  return (
    <section className="w-full">
      {(title || subtitle) && (
        <div className="flex items-center gap-3 mb-5">
          <div>
            {title && (
              <h2 className="text-base md:text-lg font-bold tracking-tight">{title}</h2>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className="flex-1 h-px bg-white/5 hidden sm:block" />
        </div>
      )}

      {/* Responsive grid via CSS — no Tailwind purge issues */}
      <style>{`
        .video-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (min-width: 640px) {
          .video-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (min-width: 768px) {
          .video-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        }
        @media (min-width: 1024px) {
          .video-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        @media (min-width: 1280px) {
          .video-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        @media (min-width: 1536px) {
          .video-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
        }
      `}</style>

      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </section>
  );
}