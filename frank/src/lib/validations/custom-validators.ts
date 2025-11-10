/**
 * Custom validation functions for enhanced validation
 * Story 1.10: Input Validation and Error Handling
 */

import { z } from 'zod';
import { errorMessages } from './error-messages';

/**
 * Validate that a string has meaningful content (not just whitespace or generic text)
 */
export function hasSubstantiveContent(text: string, minWords: number = 3): boolean {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(w => w.length > 2); // Words with 3+ chars
  return words.length >= minWords;
}

/**
 * Detect potentially vague or generic descriptions
 */
export function isVagueDescription(description: string): boolean {
  const lower = description.toLowerCase();
  const vaguePatterns = [
    /^(improve|fix|update|change|enhance)\s+(it|this|that|the\s+\w+)$/i,
    /^make\s+(it|this|that)\s+better$/i,
    /^(broken|not working|bad|slow)$/i,
  ];

  return vaguePatterns.some(pattern => pattern.test(description.trim()));
}

/**
 * Check if description needs more specifics
 */
export function needsMoreSpecifics(description: string): boolean {
  const trimmed = description.trim();
  const wordCount = trimmed.split(/\s+/).length;

  // Too short to be specific
  if (wordCount < 5) return true;

  // Check for lack of specific details
  const hasSpecifics = /\d+|specifically|example|e\.g\.|currently|should|instead/i.test(trimmed);

  return !hasSpecifics && wordCount < 15;
}

/**
 * Enhanced title validation with custom error messages
 */
export const titleValidation = z
  .string({ required_error: errorMessages.improvement.title.required })
  .min(5, errorMessages.improvement.title.tooShort)
  .max(200, errorMessages.improvement.title.tooLong)
  .trim()
  .refine(
    (val) => val.length >= 5,
    { message: errorMessages.improvement.title.tooShort }
  );

/**
 * Enhanced description validation with vagueness detection
 */
export const descriptionValidation = z
  .string({ required_error: errorMessages.improvement.description.required })
  .min(10, errorMessages.improvement.description.tooShort)
  .max(2000, errorMessages.improvement.description.tooLong)
  .trim()
  .refine(
    (val) => !isVagueDescription(val),
    { message: errorMessages.improvement.description.vague }
  );

/**
 * Evidence content validation
 */
export const evidenceContentValidation = z
  .string({ required_error: errorMessages.evidence.content.required })
  .min(5, errorMessages.evidence.content.tooShort)
  .max(1000, errorMessages.evidence.content.tooLong)
  .trim();

/**
 * Evidence source validation
 */
export const evidenceSourceValidation = z
  .string({ required_error: errorMessages.evidence.source.required })
  .min(2, errorMessages.evidence.source.tooShort)
  .max(200, errorMessages.evidence.source.tooLong)
  .trim();

/**
 * Session title validation
 */
export const sessionTitleValidation = z
  .string({ required_error: errorMessages.session.title.required })
  .min(3, errorMessages.session.title.tooShort)
  .max(100, errorMessages.session.title.tooLong)
  .trim();

/**
 * Email validation with custom error
 */
export const emailValidation = z
  .string({ required_error: errorMessages.auth.email.required })
  .email(errorMessages.auth.email.invalid);

/**
 * Password validation with strength requirements
 */
export const passwordValidation = z
  .string({ required_error: errorMessages.auth.password.required })
  .min(8, errorMessages.auth.password.tooShort)
  .regex(
    /^(?=.*[A-Z])(?=.*\d).{8,}$/,
    errorMessages.auth.password.weak
  );

/**
 * Name validation
 */
export const nameValidation = z
  .string({ required_error: errorMessages.auth.name.required })
  .min(2, errorMessages.auth.name.tooShort)
  .trim();

/**
 * Effort rationale validation
 */
export const effortRationaleValidation = z
  .string()
  .max(500, errorMessages.effort.rationale.tooLong)
  .optional();

/**
 * Validate URL format (optional helper)
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize user input to prevent XSS
 * Note: React provides built-in XSS protection, but this adds an extra layer
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Check if string contains only safe characters for display
 */
export function hasSafeCharacters(input: string): boolean {
  // Allow letters, numbers, spaces, basic punctuation
  const safePattern = /^[a-zA-Z0-9\s.,!?;:()\-'"@#$%&*+=\[\]{}|\\/<>_]+$/;
  return safePattern.test(input);
}
