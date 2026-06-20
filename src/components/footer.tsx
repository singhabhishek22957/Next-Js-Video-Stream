"use client";

import Link from "next/link";

export default function Footer() {
return ( <footer className="border-t border-border bg-background"> <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10">
{/* Brand */} <div className="mb-10"> <Link
         href="/"
         className="text-2xl font-bold text-primary"
       >
StreamFlix </Link>

      <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
        Watch trending videos, latest uploads and popular content from
        around the world. Explore videos by genre, language and region
        with new content added regularly.
      </p>
    </div>

    {/* Footer Links */}
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {/* Explore */}
      <div>
        <h3 className="mb-4 font-semibold">
          Explore
        </h3>

        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/"
              className="hover:text-primary transition-colors"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/videos"
              className="hover:text-primary transition-colors"
            >
              All Videos
            </Link>
          </li>

          <li>
            <Link
              href="/search/genre"
              className="hover:text-primary transition-colors"
            >
              Genres
            </Link>
          </li>

          <li>
            <Link
              href="/search/language"
              className="hover:text-primary transition-colors"
            >
              Languages
            </Link>
          </li>

          <li>
            <Link
              href="/search/region"
              className="hover:text-primary transition-colors"
            >
              Regions
            </Link>
          </li>
        </ul>
      </div>

      {/* Popular Genres */}
      <div>
        <h3 className="mb-4 font-semibold">
          Popular Genres
        </h3>

        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/search/genre/action">
              Action
            </Link>
          </li>

          <li>
            <Link href="/search/genre/drama">
              Drama
            </Link>
          </li>

          <li>
            <Link href="/search/genre/comedy">
              Comedy
            </Link>
          </li>

          <li>
            <Link href="/search/genre/romance">
              Romance
            </Link>
          </li>

          <li>
            <Link href="/search/genre/thriller">
              Thriller
            </Link>
          </li>
        </ul>
      </div>

      {/* Languages */}
      <div>
        <h3 className="mb-4 font-semibold">
          Languages
        </h3>

        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/search/language/hindi">
              Hindi
            </Link>
          </li>

          <li>
            <Link href="/search/language/english">
              English
            </Link>
          </li>

          <li>
            <Link href="/search/language/tamil">
              Tamil
            </Link>
          </li>

          <li>
            <Link href="/search/language/telugu">
              Telugu
            </Link>
          </li>

          <li>
            <Link href="/search/language/korean">
              Korean
            </Link>
          </li>
        </ul>
      </div>

      {/* Regions */}
      <div>
        <h3 className="mb-4 font-semibold">
          Regions
        </h3>

        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/search/region/india">
              India
            </Link>
          </li>

          <li>
            <Link href="/search/region/usa">
              USA
            </Link>
          </li>

          <li>
            <Link href="/search/region/japan">
              Japan
            </Link>
          </li>

          <li>
            <Link href="/search/region/korea">
              Korea
            </Link>
          </li>

          <li>
            <Link href="/search/region/china">
              China
            </Link>
          </li>
        </ul>
      </div>
    </div>

    {/* SEO Text */}
    <div className="mt-10 border-t border-border pt-6">
      <p className="text-sm text-muted-foreground">
        Discover thousands of videos across action, drama, comedy,
        romance and thriller genres. Browse content by language,
        region and popularity with high-quality streaming and
        regular updates.
      </p>

      <p className="mt-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} StreamFlix.
        All rights reserved.
      </p>
    </div>
  </div>
</footer>


);
}
