"use server";

export async function generateSlug(
  title: string
) {
  if (!title) return "";

  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}