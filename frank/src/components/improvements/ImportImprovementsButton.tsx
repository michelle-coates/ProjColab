"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { type Category, type EffortLevel } from "@prisma/client";

interface ImportImprovementsButtonProps {
  sessionId: string;
  onImported?: () => void;
}

type Improvement = {
  id: string;
  title: string;
  description: string;
  category: string;
  effortLevel: string | null;
};



export default function ImportImprovementsButton({ sessionId, onImported }: ImportImprovementsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: unassignedImprovements, isLoading } = api.improvements.list.useQuery({ 
    sessionId: undefined 
  });

  const [error, setError] = useState<string | null>(null);
  const [importingId, setImportingId] = useState<string | null>(null);
  
  const mutation = api.improvements.addToSession.useMutation({
    onSuccess: () => {
      onImported?.();
    },
    onError: (err) => {
      setError(err.message || "Failed to add improvement. Please try again.");
      setTimeout(() => setError(null), 3000);
    },
    onSettled: () => {
      setImportingId(null);
    },
  });

  const handleImport = (improvementId: string) => {
    setImportingId(improvementId);
    mutation.mutate({
      improvementId,
      sessionId,
    });
  };



  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded bg-white border border-[#76A99A] px-4 py-2 font-medium text-[#76A99A] transition-colors hover:bg-[#76A99A] hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Import Existing Items
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Import Existing Items</h2>
            {error && (
              <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {isLoading ? (
              <p>Loading improvements...</p>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto">
                {unassignedImprovements?.length === 0 ? (
                  <p className="text-gray-500">No unassigned improvements found.</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2">Title</th>
                        <th className="pb-2">Effort</th>
                        <th className="pb-2">Category</th>
                        <th className="pb-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {unassignedImprovements?.map((improvement: Improvement) => (
                        <tr key={improvement.id} className="border-b">
                          <td className="py-2">
                            <div>
                              <div className="font-medium">{improvement.title}</div>
                              <div className="text-sm text-gray-500">{improvement.description}</div>
                            </div>
                          </td>
                          <td className="py-2">{improvement.effortLevel || "Not set"}</td>
                          <td className="py-2">{improvement.category}</td>
                          <td className="py-2">
                            <button
                              onClick={() => handleImport(improvement.id)}
                              disabled={importingId === improvement.id}
                              className="rounded bg-[#76A99A] px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-[#68927f] disabled:opacity-50"
                            >
                              {importingId === improvement.id ? "Adding..." : "Add to Session"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}