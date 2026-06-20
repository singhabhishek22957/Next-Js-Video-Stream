import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Video } from "@/models/video.model";

export async function GET() {
  await connectDB();

  const videos = await Video.find({})
    .select(
      "slug title description thumbnailUrl duration createdAt"
    )
    .lean();

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
 xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
 xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

${videos
  .map(
    (video: any) => `
<url>
  <loc>${baseUrl}/videos/${video.slug}</loc>

  <video:video>
    <video:thumbnail_loc>
      ${video.thumbnailUrl}
    </video:thumbnail_loc>

    <video:title>
      <![CDATA[${video.title}]]>
    </video:title>

    <video:description>
      <![CDATA[${
        video.description ||
        video.title
      }]]>
    </video:description>

    <video:duration>
      ${video.duration || 0}
    </video:duration>

    <video:publication_date>
      ${new Date(
        video.createdAt
      ).toISOString()}
    </video:publication_date>
  </video:video>
</url>
`
  )
  .join("")}

</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}