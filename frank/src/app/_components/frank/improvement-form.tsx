"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import type { Category } from "@/lib/validations/improvement";
import { ValidationInput } from "@/components/ui/validation-input";
import { ValidationTextarea } from "@/components/ui/validation-textarea";
import { CompletenessIndicator } from "@/components/ui/completeness-indicator";
import { HelpTooltip } from "@/components/help/help-tooltip";
import { helpContent } from "@/lib/help/help-content";
import { errorMessages } from "@/lib/validations/error-messages";
import { isVagueDescription } from "@/lib/validations/custom-validators";

interface ImprovementFormProps {
  sessionId?: string;
  onSuccess?: () => void;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "UI_UX", label: "UI/UX" },
  { value: "DATA_QUALITY", label: "Data Quality" },
  { value: "WORKFLOW", label: "Workflow" },
  { value: "BUG_FIX", label: "Bug Fix" },
  { value: "FEATURE", label: "Feature" },
  { value: "OTHER", label: "Other" },
];

export function ImprovementForm({ sessionId, onSuccess }: ImprovementFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("OTHER");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    category?: string;
  }>({});

  const utils = api.useUtils();

  // Get completeness score
  const { data: completenessScore } = api.validation.scoreImprovement.useQuery(
    {
      title: title.trim(),
      description: description.trim(),
      category,
      evidenceCount: 0,
    },
    {
      enabled: title.length > 0 || description.length > 0,
    }
  );

  // AI description analysis (on blur)
  const analyzeDescription = api.validation.analyzeDescription.useMutation({
    onSuccess: (data) => {
      if (data.isVague && data.clarifyingQuestions.length > 0) {
        // Update error with AI suggestions
        setErrors(prev => ({
          ...prev,
          description: `${errorMessages.improvement.description.vague} Try: ${data.clarifyingQuestions[0]}`,
        }));
      }
    },
  });
  const createImprovement = api.improvements.create.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.improvements.invalidate(),
        utils.decisions.getNextPair.invalidate({ sessionId }),
        utils.decisions.getRanking.invalidate({ sessionId }),
        utils.decisions.getDecisionHistory.invalidate({ sessionId }),
      ]);
      setTitle("");
      setDescription("");
      setCategory("OTHER");
      setErrors({});
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to create improvement:", error);
    },
  });

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Title validation with friendly messages
    if (title.trim().length === 0) {
      newErrors.title = errorMessages.improvement.title.required;
    } else if (title.trim().length < 5) {
      newErrors.title = errorMessages.improvement.title.tooShort;
    } else if (title.trim().length > 200) {
      newErrors.title = errorMessages.improvement.title.tooLong;
    }

    // Description validation with friendly messages and vagueness detection
    if (description.trim().length === 0) {
      newErrors.description = errorMessages.improvement.description.required;
    } else if (description.trim().length < 10) {
      newErrors.description = errorMessages.improvement.description.tooShort;
    } else if (description.trim().length > 2000) {
      newErrors.description = errorMessages.improvement.description.tooLong;
    } else if (isVagueDescription(description)) {
      newErrors.description = errorMessages.improvement.description.vague;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createImprovement.mutate({
        title: title.trim(),
        description: description.trim(),
        category,
        sessionId,
      });
    }
  };

  const isValid = title.trim().length >= 5 && 
                  title.trim().length <= 200 && 
                  description.trim().length >= 10 && 
                  description.trim().length <= 2000;

  return (
    <div className="w-full max-w-2xl">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Add Improvement</h2>
          <p className="mt-1 text-sm text-gray-600">
            Describe a micro-improvement to prioritize
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <div className="flex items-center gap-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <HelpTooltip
                content={helpContent["improvement-title"]?.content ?? ""}
                title={helpContent["improvement-title"]?.title}
                position="right"
              />
            </div>
            <div className="mt-1">
              <ValidationInput
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={validateForm}
                placeholder="Brief title for the improvement"
                error={errors.title}
                currentLength={title.length}
                maxLength={200}
                showCount={true}
              />
            </div>
          </div>

          {/* Description Field */}
          <div>
            <div className="flex items-center gap-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <HelpTooltip
                content={helpContent["improvement-description"]?.content ?? ""}
                title={helpContent["improvement-description"]?.title}
                position="right"
              />
            </div>
            <div className="mt-1">
              <ValidationTextarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => {
                  validateForm();
                  // Trigger AI analysis if description is long enough
                  if (description.trim().length >= 10) {
                    analyzeDescription.mutate({
                      description: description.trim(),
                      title: title.trim(),
                      category,
                    });
                  }
                }}
                rows={6}
                placeholder="Detailed description of the improvement..."
                error={errors.description}
                currentLength={description.length}
                maxLength={2000}
                showCount={true}
              />
            </div>

            {/* Completeness Indicator */}
            {completenessScore && (title.length > 0 || description.length > 0) && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-700">Input Quality</span>
                  <HelpTooltip
                    content={helpContent["completeness-score"]?.content ?? ""}
                    title={helpContent["completeness-score"]?.title}
                    position="right"
                  />
                </div>
                <CompletenessIndicator score={completenessScore} showDetails={true} />
              </div>
            )}
          </div>

          {/* Category Field */}
          <div>
            <div className="flex items-center gap-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <HelpTooltip
                content={helpContent["improvement-category"]?.content ?? ""}
                title={helpContent["improvement-category"]?.title}
                position="right"
              />
            </div>
            <div className="mt-1">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#76A99A] focus:outline-none focus:ring-2 focus:ring-[#76A99A]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={!isValid || createImprovement.isPending}
              className={`rounded-md px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors ${
                !isValid || createImprovement.isPending
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-[#76A99A] hover:bg-[#669186] focus:outline-none focus:ring-2 focus:ring-[#76A99A] focus:ring-offset-2"
              }`}
            >
              {createImprovement.isPending ? "Saving..." : "Save Improvement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
