"use client";

import { useEffect, useRef } from "react";
import { updateVideoViewsAction } from "@/features/video/actions/video.action";

interface Props {
  slug: string;
  duration: number; // in seconds, from DB
}

function getThreshold(duration: number): number {
  if (duration < 120)  return duration * 0.30; // < 2 min  → 50%
  if (duration < 600)  return duration * 0.25; // 2–10 min → 30%
  if (duration < 3600) return duration * 0.15; // 10–60 min→ 15%
  return duration * 0.05;                       // 60 min+  →  5%
}

export default function VideoViewTracker({ slug, duration }: Props) {
  const watchedRef  = useRef(0);
  const firedRef    = useRef(false);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset on slug change (navigating to another video)
    watchedRef.current  = 0;
    firedRef.current    = false;
    lastTimeRef.current = null;

    const sessionKey = `viewed_${slug}`;

    // Already viewed this session — skip entirely
    if (sessionStorage.getItem(sessionKey)) {
      firedRef.current = true;
      return;
    }

    const videoEl = document.querySelector("video");
    if (!videoEl) return;

    const threshold = duration > 0
      ? getThreshold(duration)
      : 30; // fallback if duration unknown

    const onTimeUpdate = () => {
      if (firedRef.current) return;

      const current = videoEl.currentTime;
      const last    = lastTimeRef.current;

      if (last !== null) {
        const delta = current - last;
        // Only count real playback — ignore seeks (delta > 2s)
        if (delta > 0 && delta < 2) {
          watchedRef.current += delta;
        }
      }

      lastTimeRef.current = current;

      if (watchedRef.current >= threshold) {
        firedRef.current = true;
        sessionStorage.setItem(sessionKey, "1");
        updateVideoViewsAction(slug).catch(() => {});
      }
    };

    videoEl.addEventListener("timeupdate", onTimeUpdate);
    return () => videoEl.removeEventListener("timeupdate", onTimeUpdate);
  }, [slug, duration]);

  return null;
}