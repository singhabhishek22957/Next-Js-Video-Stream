import { z } from "zod";

/**
 * Common Fields
 */
export const emailSchema = z
  .email("Invalid email address")
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(50, "Password is too long");

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name is too long")
  .trim();

/**
 * Register
 */
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterInput = z.infer<
  typeof registerSchema
>;

/**
 * Login
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginInput = z.infer<
  typeof loginSchema
>;

/**
 * Change Password
 */
export const changePasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(
    (data) =>
      data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type ChangePasswordInput = z.infer<
  typeof changePasswordSchema
>;

/**
 * Forgot Password
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<
  typeof forgotPasswordSchema
>;