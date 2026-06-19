"use client";

import { memo, useRef, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import defaultThumbnail from "@/image/default-thumbnail.png";

interface Video {
  slug: string;
  title: string;
  thumbnailUrl: string;
  previewVideoUrl?: string;
  duration: number;
  views: number;
  likes: number;
  createdAt: string;
}

interface VideoCardProps {
  video: Video;
}

const formatDuration = (seconds = 0): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0)
    return h + ":" + m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
  return m + ":" + s.toString().padStart(2, "0");
};

const formatViews = (views = 0): string => {
  if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + "M";
  if (views >= 1_000) return (views / 1_000).toFixed(1) + "K";
  return views.toString();
};

const timeAgo = (date: string): string => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals = [
    { label: "year",   seconds: 31536000 },
    { label: "month",  seconds: 2592000  },
    { label: "day",    seconds: 86400    },
    { label: "hour",   seconds: 3600     },
    { label: "minute", seconds: 60       },
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1)
      return count + " " + i.label + (count > 1 ? "s" : "") + " ago";
  }
  return "just now";
};

function VideoCard({ video }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const initialSrc =
    !video.thumbnailUrl || video.thumbnailUrl === "" ? null : video.thumbnailUrl;

  const [remoteFailed, setRemoteFailed] = useState(false);
  const useDefault = !initialSrc || remoteFailed;

  const onEnter = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
  }, []);

  const onLeave = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  }, []);

  const ago = timeAgo(video.createdAt);
  const isNew = ago.includes("hour") || ago.includes("minute") || ago === "just now";

  return (
    <article className="group w-full rounded-lg transition-transform duration-200 hover:-translate-y-0.5">
      <Link href={"/" + video.slug} aria-label={video.title} className="block w-full">

        {/* Thumbnail — inline paddingBottom guarantees 16:9 height before CSS loads */}
        <div
          className="relative w-full rounded-xl overflow-hidden bg-neutral-800"
          style={{ paddingBottom: "56.25%" }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {useDefault ? (
            <Image
              src={defaultThumbnail}
              alt={video.title}
              fill
              loading="eager"
              className="object-cover opacity-60"
            />
          ) : (
            <Image
              src={initialSrc!}
              alt={video.title}
              fill
              unoptimized
              // loading="lazy"
              priority
              sizes="(max-width: 400px) 50vw, (max-width: 640px) 33vw, (max-width: 768px) 25vw, 15vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setRemoteFailed(true)}
            />
          )}

          {video.previewVideoUrl && (
            <video
              ref={videoRef}
              src={video.previewVideoUrl}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}

          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-semibold px-1 py-0.5 rounded leading-tight">
            {formatDuration(video.duration)}
          </span>

          {isNew && (
            <span className="absolute top-1 left-1 bg-primary text-white text-[9px] font-bold px-1 py-0.5 rounded uppercase tracking-wide leading-tight">
              New
            </span>
          )}
        </div>

        {/* Info */}
        <div className="mt-1.5 px-0.5">
          <h2 className="font-semibold text-[11px] leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
            {video.title}
          </h2>
          <div className="mt-0.5 flex items-center gap-1 flex-wrap text-[9px] text-muted-foreground">
            <span>{formatViews(video.views)} views</span>
            <span className="opacity-40">·</span>
            <span>{video.likes} likes</span>
            <span className="opacity-40">·</span>
            <span className={isNew ? "text-green-500 font-medium" : ""}>{ago}</span>
          </div>
        </div>

      </Link>
    </article>
  );
}

export default memo(VideoCard);