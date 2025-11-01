"use client";

import { useState } from "react";
import { api } from "../../trpc/react";

export default function ClaudeDemo() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateQuestions = api.claude.generateSocraticQuestions.useMutation({
    onSuccess: (data) => {
      setQuestions(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Error:", error);
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setIsLoading(true);
    generateQuestions.mutate({
      topic: topic.trim(),
      difficulty: "intermediate",
    });
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Frank AI Demo
        </h1>
        <p className="text-lg text-gray-600">
          Test Frank's AI Socratic Interrogation capabilities
        </p>
      </div>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold">Generate Socratic Questions</h2>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label htmlFor="topic" className="mb-2 block text-sm font-medium text-gray-700">
              Topic for exploration:
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., machine learning, philosophy, business strategy..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Generating..." : "Generate Questions"}
          </button>
        </form>

        {questions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-900">Generated Questions:</h3>
            {questions.map((q, index) => (
              <div key={index} className="rounded-lg border border-gray-200 p-4">
                <p className="mb-2 font-medium text-gray-900">{q.question}</p>
                <p className="mb-3 text-sm text-gray-600">{q.context}</p>
                <div className="text-xs text-gray-500">
                  <strong>Follow-up suggestions:</strong>
                  <ul className="mt-1 list-inside list-disc">
                    {q.followUpSuggestions.map((suggestion: string, i: number) => (
                      <li key={i}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg bg-blue-50 p-6">
        <h3 className="mb-2 text-lg font-medium text-blue-900">About Frank's AI</h3>
        <p className="text-blue-800">
          Frank uses Claude AI to generate thoughtful Socratic questions that help users discover deeper insights,
          challenge assumptions, and connect concepts. This demo shows the question generation capability.
          The full Frank system will include response processing, learning path generation, and adaptive conversations.
        </p>
      </div>
    </div>
  );
}