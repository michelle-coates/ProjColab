import { z } from "zod";

/**
 * Password validation regex:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 number
 */
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * User registration schema
 */
export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordRegex,
      "Password must contain at least 1 uppercase letter and 1 number"
    ),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["FREE", "TEAM", "ENTERPRISE"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * User login schema
 */
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Password reset request schema
 */
export const requestPasswordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetSchema
>;

/**
 * Password reset schema
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordRegex,
      "Password must contain at least 1 uppercase letter and 1 number"
    ),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Profile update schema
 */
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.enum(["FREE", "TEAM", "ENTERPRISE"]).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Resend verification email schema
 */
export const resendVerificationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
