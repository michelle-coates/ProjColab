"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import type { Category } from "@/lib/validations/improvement";

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

    if (title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (title.trim().length > 200) {
      newErrors.title = "Title must be at most 200 characters";
    }

    if (description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (description.trim().length > 2000) {
      newErrors.description = "Description must be at most 2000 characters";
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <div className="mt-1">
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={validateForm}
                className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                  errors.title
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-[#76A99A] focus:ring-[#76A99A]"
                }`}
                placeholder="Brief title for the improvement"
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className={errors.title ? "text-red-600" : "text-gray-500"}>
                  {errors.title || " "}
                </span>
                <span className={`${
                  title.length < 5 || title.length > 200 ? "text-red-600" : "text-gray-500"
                }`}>
                  {title.length}/200
                </span>
              </div>
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={validateForm}
                rows={6}
                className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                  errors.description
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-[#76A99A] focus:ring-[#76A99A]"
                }`}
                placeholder="Detailed description of the improvement..."
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className={errors.description ? "text-red-600" : "text-gray-500"}>
                  {errors.description || " "}
                </span>
                <span className={`${
                  description.length < 10 || description.length > 2000 ? "text-red-600" : "text-gray-500"
                }`}>
                  {description.length}/2000
                </span>
              </div>
            </div>
          </div>

          {/* Category Field */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
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
