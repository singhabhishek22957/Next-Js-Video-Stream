"use client";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  genres: string[];
  regions: string[];
  languages: string[];
}

function toSentenceCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function Footer({ genres, regions, languages }: FooterProps) {
  
  return (
    <footer className="border-t border-border bg-background">
      {" "}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10">
        {/* Brand */}{" "}
        <div className="mb-10">
          {" "}
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-primary"
          >
            <Image
              src="/logo.png"
              alt="Desixyz Logo"
              width={40}
              height={40}
              priority
            />
            <span>Desixyz</span>
          </Link>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            Watch trending videos, latest uploads and popular content from
            around the world. Explore videos by genre, language and region with
            new content added regularly.
          </p>
        </div>
        {/* Footer Links */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Explore */}
          <div>
            <h3 className="mb-4 font-semibold">Explore</h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
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
            <h3 className="mb-4 font-semibold">Popular Video Genres</h3>

            <ul className="space-y-2 text-sm">
              {genres.length > 0 &&
                genres.slice(0, 5).map((genre: any) => (
                  <li
                    key={genre._id}
                    className="hover:text-primary transition-colors"
                  >
                    <Link href={`/search/genre/${genre.name}`}>
                      Watch {toSentenceCase(genre.name)}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h3 className="mb-4 font-semibold">Browse Videos by Language</h3>

            <ul className="space-y-2 text-sm">
              {languages.length > 0 &&
                languages.slice(0, 5).map((lang: any) => (
                  <li
                    key={lang._id}
                    className="hover:text-primary transition-colors"
                  >
                    <Link href={`/search/language/${lang.name}`}>
                      {toSentenceCase(lang.name)}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h3 className="mb-4 font-semibold">Browse Videos by Region</h3>

            <ul className="space-y-2 text-sm">
              {regions.length > 0 &&
                regions.slice(0, 5).map((reg: any) => (
                  <li
                    key={reg._id}
                    className="hover:text-primary transition-colors"
                  >
                    <Link href={`/search/region/${reg.name}`}>
                      {toSentenceCase(reg.name)}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <nav aria-label="Company">
            <h2 className="mb-4 font-semibold">Company</h2>

            <ul className="space-y-2 text-sm">
              <li className="hover:text-primary transition-colors">
                <Link href="/about">About</Link>
              </li>

              <li className="hover:text-primary transition-colors">
                <Link href="/contact">Contact</Link>
              </li>

              <li className="hover:text-primary transition-colors">
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>

              <li className="hover:text-primary transition-colors">
                <Link href="/terms">Terms of Service</Link>
              </li>

              <li className="hover:text-primary transition-colors">
                <Link href="/dmca">DMCA</Link>
              </li>
            </ul>
          </nav>
        </div>
        {/* SEO Text */}
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            Desixyz lets you discover trending videos from multiple genres,
            languages and regions. Watch Action, Romance, Drama, Comedy and
            Thriller videos in Hindi, English, Punjabi, Tamil, Telugu and many
            more languages. Browse content by country, category and popularity
            with fast streaming, HD quality and regularly updated collections.
          </p>

          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Desixyz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
