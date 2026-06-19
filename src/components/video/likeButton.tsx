"use client";

import { useEffect, useState } from "react";
import { updateVideoLikesAction } from "@/features/video/actions/video.action";

interface Props {
  slug: string;
  initialLikes: number;
}

export default function LikeButton({ slug, initialLikes }: Props) {
  const [liked, setLiked]   = useState(false);
  const [likes, setLikes]   = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(`liked_${slug}`) === "1") {
      setLiked(true);
    }
  }, [slug]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    const action  = liked ? "unlike" : "like";
    const newLiked = !liked;

    // Optimistic update
    setLiked(newLiked);
    setLikes((prev) => prev + (newLiked ? 1 : -1));

    const result = await updateVideoLikesAction(slug, action);

    if (result.success) {
      setLikes(result.likes);
      if (newLiked) {
        localStorage.setItem(`liked_${slug}`, "1");
      } else {
        localStorage.removeItem(`liked_${slug}`);
      }
    } else {
      // Revert on failure
      setLiked(liked);
      setLikes((prev) => prev + (newLiked ? -1 : 1));
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all
        ${liked
          ? "border-red-500/40 bg-red-500/10 text-red-500 hover:bg-red-500/20"
          : "border-border bg-background text-foreground hover:bg-surface"
        }
        ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      {likes.toLocaleString()}
    </button>
  );
}