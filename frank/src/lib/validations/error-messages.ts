/**
 * User-friendly error message mapping system
 * Story 1.10: Input Validation and Error Handling
 *
 * Philosophy: Helpful, not judgmental. Actionable, not vague. Frank's "Think with me" tone.
 */

export const errorMessages = {
  // Improvement validation
  improvement: {
    title: {
      required: "Let's add a title to describe this improvement",
      tooShort: "Could you add a bit more detail to the title? At least 5 characters helps us understand it better",
      tooLong: "Let's keep the title concise - 200 characters max. You can add detail in the description",
      invalid: "The title contains some invalid characters. Let's use letters, numbers, and basic punctuation",
    },
    description: {
      required: "Let's add a description to explain this improvement",
      tooShort: "Could you add more detail to help us understand this improvement? At least 10 characters works best",
      tooLong: "That's quite detailed! Let's keep it under 2000 characters for better readability",
      vague: "This description could use more specifics. What exactly needs to improve, and why?",
    },
    category: {
      required: "Let's pick a category that best fits this improvement",
      invalid: "That category isn't one we recognize. Please choose from the available options",
    },
  },

  // Evidence validation
  evidence: {
    content: {
      required: "Let's add some evidence to support this improvement",
      tooShort: "Could you add more detail to this evidence? At least 5 characters helps",
      tooLong: "Let's keep evidence entries focused - 1000 characters max per piece",
    },
    source: {
      required: "Where did this evidence come from? Adding a source helps build trust",
      tooShort: "Could you add a bit more detail about the source?",
      tooLong: "Let's keep the source brief - 200 characters max",
    },
  },

  // Effort validation
  effort: {
    level: {
      required: "Let's estimate the effort level for this improvement",
      invalid: "Please choose SMALL, MEDIUM, or LARGE for the effort level",
    },
    rationale: {
      tooLong: "Let's keep the rationale concise - 500 characters max",
    },
  },

  // Session validation
  session: {
    title: {
      required: "Let's give this session a name",
      tooShort: "Could you add a bit more to the session title? At least 3 characters helps",
      tooLong: "Let's keep the session title concise - 100 characters max",
    },
    description: {
      tooLong: "Let's keep the session description under 500 characters",
    },
  },

  // Auth validation
  auth: {
    email: {
      required: "Let's add your email address",
      invalid: "This doesn't look like a valid email address. Could you check it?",
      alreadyExists: "This email is already registered. Try logging in instead?",
    },
    password: {
      required: "Let's create a password",
      tooShort: "For security, let's use at least 8 characters",
      weak: "For better security, include at least 1 uppercase letter and 1 number",
      mismatch: "These passwords don't match. Could you try again?",
    },
    name: {
      required: "Let's add your name",
      tooShort: "Could you add your full name? At least 2 characters helps",
    },
  },

  // Onboarding validation
  onboarding: {
    role: {
      required: "Let's select your role to personalize your experience",
      invalid: "That role isn't one we recognize. Please choose from the available options",
    },
  },

  // Generic validation
  generic: {
    required: "This field is required",
    invalid: "This value doesn't look right. Could you check it?",
    tooShort: "This needs to be a bit longer",
    tooLong: "This is a bit too long",
    notFound: "We couldn't find what you're looking for",
    unauthorized: "You don't have permission to access this",
    serverError: "Something went wrong on our end. Please try again",
  },
} as const;

/**
 * Get a user-friendly error message for a validation error
 * Falls back to generic messages if specific path not found
 */
export function getErrorMessage(
  path: string,
  type: string = 'invalid'
): string {
  const parts = path.split('.');
  let message: any = errorMessages;

  for (const part of parts) {
    message = message?.[part];
    if (!message) {
      return errorMessages.generic[type as keyof typeof errorMessages.generic] || errorMessages.generic.invalid;
    }
  }

  if (typeof message === 'string') {
    return message;
  }

  return message[type] || errorMessages.generic[type as keyof typeof errorMessages.generic] || errorMessages.generic.invalid;
}

/**
 * Error type mapping for Zod errors
 */
export const zodErrorTypeMap: Record<string, string> = {
  too_small: 'tooShort',
  too_big: 'tooLong',
  invalid_type: 'required',
  invalid_string: 'invalid',
  invalid_enum_value: 'invalid',
};
