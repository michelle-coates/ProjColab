"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/trpc/react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const requestResetMutation = api.auth.requestPasswordReset.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestResetMutation.mutateAsync({ email });
  };

  if (submitted) {
    return (
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-[#1D1F21]">Check your email</h2>
        <p className="mb-6 text-gray-600">
          If an account exists with the email <strong>{email}</strong>, you will receive
          a password reset link shortly.
        </p>
        <Link
          href="/sign-in"
          className="block w-full rounded bg-[#76A99A] px-4 py-2 text-center font-medium text-white transition-colors hover:bg-[#68927f]"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold text-[#1D1F21]">Reset your password</h2>
      <p className="mb-6 text-gray-600">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#1D1F21]">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
            placeholder="you@example.com"
            required
          />
        </div>

        <button
          type="submit"
          disabled={requestResetMutation.isPending}
          className="w-full rounded bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#68927f] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {requestResetMutation.isPending ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Remember your password?{" "}
        <Link href="/sign-in" className="text-[#76A99A] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
