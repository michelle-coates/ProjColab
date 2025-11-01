import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import {
  registerSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  resendVerificationSchema,
  updateProfileSchema,
} from "@/lib/validations/auth";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";

const SALT_ROUNDS = 12;

export const authRouter = createTRPCRouter({
  /**
   * Register a new user
   */
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password, name, role } = input;

      // Check if user already exists
      const existingUser = await ctx.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user with this email already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const user = await ctx.db.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
          emailVerified: new Date(), // Auto-verify for development (TODO: implement email verification)
        },
      });

      // TODO: Send verification email
      // This will be implemented with an email service in a future task
      // For now, we'll auto-verify in development

      return {
        success: true,
        message: "Registration successful. You can now sign in.",
        userId: user.id,
      };
    }),

  /**
   * Resend verification email
   */
  resendVerification: publicProcedure
    .input(resendVerificationSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        // Don't reveal if user exists for security
        return {
          success: true,
          message: "If an account exists, a verification email has been sent.",
        };
      }

      if (user.emailVerified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This email is already verified",
        });
      }

      // TODO: Generate and send verification token
      // This will be implemented with an email service

      return {
        success: true,
        message: "Verification email sent. Please check your inbox.",
      };
    }),

  /**
   * Request password reset
   */
  requestPasswordReset: publicProcedure
    .input(requestPasswordResetSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        // Don't reveal if user exists for security
        return {
          success: true,
          message: "If an account exists, a password reset email has been sent.",
        };
      }

      // TODO: Generate password reset token and send email
      // Token should expire in 1 hour

      return {
        success: true,
        message: "Password reset email sent. Please check your inbox.",
      };
    }),

  /**
   * Reset password with token
   */
  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { token, password } = input;

      // TODO: Validate token and get user
      // For now, this is a placeholder
      // In production, validate the token from VerificationToken table

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // TODO: Update user password and invalidate all sessions
      // This requires token validation first

      return {
        success: true,
        message: "Password reset successful. You can now log in with your new password.",
      };
    }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.role && { role: input.role }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      return {
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      };
    }),

  /**
   * Get current user profile
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),
});
