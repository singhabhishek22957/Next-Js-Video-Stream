"use client";

import { ReactNode, useState } from "react";

interface DescriptionToggleProps {
  description: string;
  metadata: { label: string; value: ReactNode }[];
  tags: string[];
}

export default function DescriptionToggle({
  description,
  metadata,
  tags,
}: DescriptionToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      {/* HEADER — always visible, clickable */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-border/10 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            About this video
          </p>
          {!open && (
            <p className="text-xs text-muted-foreground truncate max-w-[260px] sm:max-w-[400px]">
              — {description.slice(0, 80)}
              {description.length > 80 ? "..." : ""}
            </p>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* EXPANDED CONTENT */}
      {open && (
        <div className="px-4 pb-4 border-t border-border pt-3">
          <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground mb-4">
            {description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {metadata.map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground mb-0.5">
                  {label}
                </p>
                <div className="text-sm">{value}</div>
              </div>
            ))}
          </div>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
