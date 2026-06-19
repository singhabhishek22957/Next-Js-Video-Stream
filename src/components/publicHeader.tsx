"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";

import ThemeToggle from "./themeToggle";
import { useRouter } from "next/navigation";

interface PublicHeaderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PublicHeader({ open, setOpen }: PublicHeaderProps) {
  const [keyword, setKeyword] = useState("");

  const [mobileSearch, setMobileSearch] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = keyword.trim();

    if (!query) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(query)}`);

    setMobileSearch(false);
  };

  return (
    <>
      <header
        className="
          fixed top-0 right-0 left-0  z-50
          w-full
          bg-surface
          border-b border-border
          backdrop-blur-md
        "
      >
        <div
          className="
            mx-auto
            max-w-[1400px]

            h-14
            md:h-16

            px-4
            md:px-6
            lg:px-8

            flex
            items-center
            justify-between
            gap-4
          "
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="
                lg:hidden

                p-2

                rounded-lg

                hover:bg-background
              "
            >
              <Menu size={22} />
            </button>

            <Link
              href="/"
              className="
                font-bold

                text-xl
                md:text-2xl

                text-primary
              "
            >
              StreamFlix
            </Link>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="
              hidden md:flex

              flex-1
              max-w-2xl

              bg-background

              border border-border

              rounded-full
              overflow-hidden
            "
          >
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search videos..."
              className="
                flex-1

                px-4 py-2

                bg-transparent

                text-foreground
                placeholder:text-muted

                outline-none
              "
            />

            <button
              type="submit"
              className="
                px-5

                bg-primary
                text-white

                hover:bg-secondary

                transition
              "
            >
              <Search size={18} />
            </button>
          </form>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <button
              onClick={() => setMobileSearch(true)}
              className="
                md:hidden

                p-2

                rounded-lg

                hover:bg-background
              "
            >
              <Search size={20} />
            </button>

            {/* Theme */}
            <div
              className="
                h-10 w-10

                flex
                items-center
                justify-center

                rounded-full

                border border-border

                bg-background
              "
            >
              <ThemeToggle />
            </div>

            {/* Login */}
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {mobileSearch && (
        <div
          className="
            fixed
            inset-0

            z-[100]

            bg-background

            md:hidden
          "
        >
          <form onSubmit={handleSearch} className="p-4 flex gap-2">
            <button
              type="button"
              onClick={() => setMobileSearch(false)}
              className="p-2"
            >
              <X />
            </button>

            <input
              autoFocus
              type="text"
              placeholder="Search videos..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="
      flex-1
      px-4 py-2
      rounded-full
      bg-surface
      border border-border
      text-foreground
      placeholder:text-muted
      outline-none
    "
            />

            <button
              type="submit"
              className="
      px-4
      rounded-full
      bg-primary
      text-white
    "
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
