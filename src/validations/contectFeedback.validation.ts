import { z } from "zod";

/**
 * Reusable Fields
 */
export const subjectSchema = z
  .string()
  .min(3, "Subject must be at least 3 characters")
  .max(100, "Subject is too long")
  .trim();

export const emailSchema = z
  .email("Invalid email address")
  .toLowerCase()
  .trim();

export const messageSchema = z
  .string()
  .min(10, "Message must be at least 10 characters")
  .max(2000, "Message is too long")
  .trim();

export const statusSchema = z.enum([
  "pending",
  "queued",
  "resolved",
  "rejected",
]);

/**
 * Create Feedback
 */
export const createFeedbackSchema = z.object({
  subject: subjectSchema,
  email: emailSchema,
  message: messageSchema,
});

export type CreateFeedbackInput = z.infer<
  typeof createFeedbackSchema
>;

/**
 * Update Feedback Status
 */
export const updateFeedbackSchema = z.object({
  status: statusSchema,
});

export type UpdateFeedbackInput = z.infer<
  typeof updateFeedbackSchema
>;