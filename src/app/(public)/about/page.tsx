import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Desixyz",
  description:
    "Learn more about Desixyz, a platform for discovering trending videos across genres, languages, and regions.",
};

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">About Desixyz</h1>

      <div className="space-y-6 text-muted-foreground leading-8">
        <p>
          Desixyz is a video streaming platform that helps users discover
          trending and popular videos across multiple genres, languages, and
          regions.
        </p>

        <p>
          Our mission is to provide an easy and enjoyable experience for finding
          high-quality video content through organized categories, powerful
          search, and regularly updated collections.
        </p>

        <p>
          Whether you're looking for the latest uploads, trending videos, or
          content from a specific language or region, Desixyz makes discovering
          new entertainment simple.
        </p>
      </div>
    </main>
  );
}