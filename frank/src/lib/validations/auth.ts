import { z } from "zod";
import { emailValidation, passwordValidation, nameValidation } from "./custom-validators";
import { errorMessages } from "./error-messages";

/**
 * User registration schema with enhanced validation
 */
export const registerSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
  name: nameValidation,
  role: z.enum(["FREE", "TEAM", "ENTERPRISE"], {
    errorMap: () => ({ message: errorMessages.onboarding.role.invalid }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * User login schema with enhanced validation
 */
export const loginSchema = z.object({
  email: emailValidation,
  password: z.string({ required_error: errorMessages.auth.password.required }).min(1, errorMessages.auth.password.required),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Password reset request schema with enhanced validation
 */
export const requestPasswordResetSchema = z.object({
  email: emailValidation,
});

export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetSchema
>;

/**
 * Password reset schema with enhanced validation
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordValidation,
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Profile update schema with enhanced validation
 */
export const updateProfileSchema = z.object({
  name: nameValidation.optional(),
  role: z.enum(["FREE", "TEAM", "ENTERPRISE"]).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Resend verification email schema with enhanced validation
 */
export const resendVerificationSchema = z.object({
  email: emailValidation,
});

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
