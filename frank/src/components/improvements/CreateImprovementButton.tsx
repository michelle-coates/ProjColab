"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

type Category = "UI_UX" | "DATA_QUALITY" | "WORKFLOW" | "BUG_FIX" | "FEATURE" | "OTHER";

interface CreateImprovementButtonProps {
  sessionId: string;
  onCreated?: () => void;
}

export default function CreateImprovementButton({ sessionId, onCreated }: CreateImprovementButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("FEATURE");

  const { mutate, isLoading } = api.improvements.create.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      setTitle("");
      setDescription("");
      onCreated?.();
    },
  });

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#68927f]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Improvement
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">New Improvement</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mutate({
                  title,
                  description,
                  category,
                  sessionId,
                });
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
                  required
                >
                  <option value="UI_UX">UI/UX</option>
                  <option value="DATA_QUALITY">Data Quality</option>
                  <option value="WORKFLOW">Workflow</option>
                  <option value="BUG_FIX">Bug Fix</option>
                  <option value="FEATURE">Feature</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#68927f] disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}