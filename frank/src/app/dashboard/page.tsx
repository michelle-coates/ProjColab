"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F6F7F8] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#1D1F21]">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back, {session?.user?.name}!</p>
          </div>
          <Link
            href="/profile"
            className="rounded bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#68927f]"
          >
            Edit Profile
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-[#1D1F21]">Account Type</h3>
            <p className="text-2xl font-bold text-[#76A99A]">
              {session?.user?.role ?? "FREE"}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-[#1D1F21]">Email</h3>
            <p className="text-sm text-gray-600">{session?.user?.email}</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-[#1D1F21]">Sessions</h3>
            <p className="text-2xl font-bold text-[#76A99A]">0</p>
            <p className="mt-1 text-xs text-gray-500">Coming soon</p>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-[#1D1F21]">
            Welcome to Frank
          </h2>
          <p className="mb-4 text-gray-600">
            Your AI-powered product prioritization assistant. Start creating prioritization
            sessions to make better product decisions.
          </p>
          <div className="flex gap-4">
            <button className="rounded bg-[#76A99A] px-6 py-2 font-medium text-white transition-colors hover:bg-[#68927f]">
              New Session
            </button>
            <button className="rounded border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
