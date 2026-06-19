"use client";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import defaultThumbnail from "@/image/default-thumbnail.png";

interface CategoryCardProps {
  type: string;
  value: string;
  thumbnailUrl?: string | StaticImageData;
}

export default function CategoryCard({ type, value, thumbnailUrl }: CategoryCardProps) {
  const isStaticImport = thumbnailUrl && typeof thumbnailUrl === "object";
  const resolvedSrc = !thumbnailUrl || thumbnailUrl === "" ? defaultThumbnail : thumbnailUrl;

  return (
    <Link href={`/search/${type}/${value}`} className="group block w-full">
      {/*
        padding-bottom: 56.25% = 16:9 ratio trick.
        Works 100% of the time regardless of parent flex/grid context.
        position: relative is mandatory for the absolute children to size correctly.
      */}
      <div className="relative w-full rounded-xl overflow-hidden bg-neutral-900" style={{ paddingBottom: "56.25%" }}>

        {/* Image */}
        <Image
          src={resolvedSrc}
          alt={value}
          fill
          priority
          {...(isStaticImport ? { placeholder: "blur" } : {})}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultThumbnail.src;
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t  from-black/80 via-black/30 to-black/10 transition-opacity duration-300 group-hover:from-black/60 group-hover:via-black/20 group-hover:to-transparent" />

        {/* Hover ring */}
        <div className="absolute inset-0 rounded-xl ring-0 ring-white/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-white/30" />

        {/* Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="capitalize text-center font-bold text-white text-lg md:text-xl px-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] tracking-wide">
            {value.toUpperCase()}
          </h3>
        </div>
      </div>
    </Link>
  );
}