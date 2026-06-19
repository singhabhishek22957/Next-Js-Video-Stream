import { z } from "zod";

/**
 * Reusable Fields
 */
export const titleSchema = z
  .string()
  .min(3, "Title must be at least 3 characters")
  .max(200, "Title is too long")
  .trim();

export const slugSchema = z
  .string()
  .min(3, "Slug is required")
  .trim();

export const descriptionSchema = z
  .string()
  .max(2000)
  .optional();

export const videoUrlSchema = z.url(
  "Invalid video URL"
);

export const thumbnailUrlSchema = z
  .url("Invalid thumbnail URL")
  .optional();

export const previewVideoUrlSchema = z
  .url("Invalid preview video URL")
  .optional();

export const lessonIdSchema = z
  .string()
  .optional();

export const durationSchema = z
  .number()
  .nonnegative()
  .optional();

export const actorsSchema = z
  .array(z.string())
  .default([]);

export const tagsSchema = z
  .array(z.string())
  .default([]);

export const statusSchema = z.enum([
  "unlisted",
  "published",
]);

export const regionSchema = z.enum([
  "India",
  "USA",
  "UK",
  "Japan",
  "Korea",
  "France",
  "Other",
]);

export const languageSchema = z.enum([
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Other",
]);

/**
 * Create Video
 */
export const createVideoSchema = z.object({
  title: titleSchema,
  slug: slugSchema,
  description: descriptionSchema,
  lessonId: lessonIdSchema,
  videoUrl: videoUrlSchema,
  thumbnailUrl: thumbnailUrlSchema,
  previewVideoUrl: previewVideoUrlSchema,
  duration: durationSchema,
  actors: actorsSchema,
  tags: tagsSchema,
  status: statusSchema.default("published"),
  region: regionSchema.default("Other"),
  language: languageSchema.default("Other"),
});

export type CreateVideoInput =
  z.infer<typeof createVideoSchema>;

/**
 * Update Video
 */
export const updateVideoSchema =
  createVideoSchema.partial();

export type UpdateVideoInput =
  z.infer<typeof updateVideoSchema>;