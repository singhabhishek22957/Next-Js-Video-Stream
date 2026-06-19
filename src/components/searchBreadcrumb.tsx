"use client";

import Link from "next/link";
import { Home } from "lucide-react";

interface SearchBreadcrumbProps {
  type?: string;
  value?: string;
}

export default function SearchBreadcrumb({
  type,
  value,
}: SearchBreadcrumbProps) {
  return (
    <div
      className="
        flex
        items-center
        gap-2

        text-sm

        text-muted-foreground
      "
    >
      <Link
        href="/"
        className="
          hover:text-primary
          transition
        "
      >
        <Home size={16} />
      </Link>

      <span>/</span>

      <Link
        href="/search"
        className="
          hover:text-primary
        "
      >
        Search
      </Link>

      {type && (
        <>
          <span>/</span>

          <Link
            href={`/search/${type}`}
            className="
              capitalize
              hover:text-primary
            "
          >
            {type}
          </Link>
        </>
      )}

      {value && (
        <>
          <span>/</span>

          <span className="capitalize">
            {value}
          </span>
        </>
      )}
    </div>
  );
}