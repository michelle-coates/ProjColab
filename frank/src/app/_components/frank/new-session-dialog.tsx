"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { type Session } from "@prisma/client";

interface NewSessionDialogProps {
  onClose: () => void;
  onCreate: (session: Session) => void;
}

export function NewSessionDialog({ onClose, onCreate }: NewSessionDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createSession = api.sessions.create.useMutation({
    onSuccess: (newSession) => {
      onCreate(newSession);
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSession.mutate({ name, description });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-[#1D1F21]">
          Create New Prioritization Session
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-[#1D1F21]">
              Session Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
              placeholder="e.g., Mobile App Q1 Improvements"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-[#1D1F21]">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
              rows={3}
              placeholder="Add context about this prioritization session"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createSession.isLoading}
              className="rounded bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#68927f] disabled:opacity-50"
            >
              {createSession.isLoading ? "Creating..." : "Create Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}