import { Video } from "@/models/video.model";

export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function generateSlug(
  title: string
) {
  const slug = slugify(title);

  const existing = await Video.findOne({
    slug,
    isDeleted: false,
  }).lean();

  if (existing) {
    return null;
  }

  return slug;
}