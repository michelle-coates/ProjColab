"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/trpc/react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetPasswordMutation = api.auth.resetPassword.useMutation({
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    await resetPasswordMutation.mutateAsync({ token, password });
  };

  if (success) {
    return (
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-[#1D1F21]">Password reset successful</h2>
        <p className="mb-6 text-gray-600">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Link
          href="/sign-in"
          className="block w-full rounded bg-[#76A99A] px-4 py-2 text-center font-medium text-white transition-colors hover:bg-[#68927f]"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold text-[#1D1F21]">Set new password</h2>

      {error && (
        <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-[#1D1F21]">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
            placeholder="Min. 8 characters, 1 uppercase, 1 number"
            required
            disabled={!token}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-[#1D1F21]">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
            placeholder="Re-enter your password"
            required
            disabled={!token}
          />
        </div>

        <button
          type="submit"
          disabled={resetPasswordMutation.isPending || !token}
          className="w-full rounded bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#68927f] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resetPasswordMutation.isPending ? "Resetting..." : "Reset password"}
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
