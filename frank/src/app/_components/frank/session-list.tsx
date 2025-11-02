"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { NewSessionDialog } from "./new-session-dialog";

interface SessionListProps {
  onSessionCreated?: () => void;
}

export function SessionList({ onSessionCreated }: SessionListProps) {
  const [isNewSessionDialogOpen, setIsNewSessionDialogOpen] = useState(false);

  const { data: sessions, refetch } = api.sessions.list.useQuery();

  return (
    <div className="space-y-4">
      {/* Add Session Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsNewSessionDialogOpen(true)}
          className="rounded bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#68927f]"
        >
          New Session
        </button>
      </div>

      {/* Sessions List */}
      <div className="grid gap-4">
        {sessions?.map((session) => (
          <div
            key={session.id}
            className="rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1D1F21]">{session.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Started {new Date(session.startedAt).toLocaleDateString()}
                </p>
              </div>
              <Link
                href={`/sessions/${session.id}`}
                className="rounded bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#68927f]"
              >
                View Session
              </Link>
            </div>
            {session.description && (
              <p className="mt-4 text-gray-600">{session.description}</p>
            )}
          </div>
        ))}

        {sessions?.length === 0 && (
          <div className="rounded-lg bg-white p-6 text-center text-gray-500">
            No sessions yet. Create your first prioritization session to get started.
          </div>
        )}
      </div>

      {/* New Session Dialog */}
      {isNewSessionDialogOpen && (
        <NewSessionDialog
          onClose={() => setIsNewSessionDialogOpen(false)}
          onCreate={async () => {
            await refetch();
            setIsNewSessionDialogOpen(false);
            onSessionCreated?.();
          }}
        />
      )}
    </div>
  );
}