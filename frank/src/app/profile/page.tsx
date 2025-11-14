"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import type { UpdateProfileInput } from "@/lib/validations/auth";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<UpdateProfileInput>({
    name: "",
    role: undefined,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);

  const { data: profile, isLoading } = api.auth.getProfile.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const { data: improvements } = api.improvements.list.useQuery({}, {
    enabled: status === "authenticated",
  });

  const updateProfileMutation = api.auth.updateProfile.useMutation({
    onSuccess: () => {
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const clearSampleDataMutation = api.onboarding.clearSampleData.useMutation({
    onSuccess: (result) => {
      setSuccessMessage(result.message);
      setShowClearDataConfirm(false);
      setTimeout(() => setSuccessMessage(""), 5000);
    },
  });

  const sampleItemsCount = improvements?.filter(item => item.isOnboardingSample).length ?? 0;

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name ?? "",
        role: profile.role,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    try {
      await updateProfileMutation.mutateAsync(formData);
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleClearSampleData = async () => {
    await clearSampleDataMutation.mutateAsync();
  };

  if (status === "loading" || isLoading) {
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
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#1D1F21]">Profile Settings</h1>
            <p className="mt-2 text-gray-600">Manage your account information</p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#68927f]"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-sm">
          {successMessage && (
            <div className="mb-4 rounded bg-green-50 p-3 text-sm text-green-800">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#1D1F21]">
                Email
              </label>
              <input
                type="email"
                value={profile?.email ?? ""}
                disabled
                className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-600"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-[#1D1F21]">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="role" className="mb-1 block text-sm font-medium text-[#1D1F21]">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
              >
                <option value="FREE">Free</option>
                <option value="TEAM">Team</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="rounded bg-[#76A99A] px-6 py-2 font-medium text-white transition-colors hover:bg-[#68927f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save changes"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-8 border-t pt-8">
            <h3 className="mb-4 text-lg font-semibold text-[#1D1F21]">Account Actions</h3>
            <div className="space-y-4">
              {/* Clear Sample Data Section (Story 1.17) */}
              {sampleItemsCount > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <h4 className="mb-2 font-semibold text-amber-900">Sample Data Management</h4>
                  <p className="mb-3 text-sm text-amber-800">
                    You have {sampleItemsCount} sample improvement{sampleItemsCount === 1 ? "" : "s"} from the tutorial.
                    These are labeled with a "Sample" badge.
                  </p>
                  {!showClearDataConfirm ? (
                    <button
                      onClick={() => setShowClearDataConfirm(true)}
                      className="rounded border border-amber-600 bg-white px-4 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
                    >
                      Clear Sample Data
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-amber-900">
                        Are you sure? This will permanently delete all {sampleItemsCount} sample item{sampleItemsCount === 1 ? "" : "s"} and their related data.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleClearSampleData}
                          disabled={clearSampleDataMutation.isPending}
                          className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {clearSampleDataMutation.isPending ? "Deleting..." : "Yes, Delete Sample Data"}
                        </button>
                        <button
                          onClick={() => setShowClearDataConfirm(false)}
                          disabled={clearSampleDataMutation.isPending}
                          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleSignOut}
                className="rounded border border-red-300 px-6 py-2 font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        {profile && (
          <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-[#1D1F21]">Account Information</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Account ID:</dt>
                <dd className="font-mono text-gray-900">{profile.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Member since:</dt>
                <dd className="text-gray-900">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Email verified:</dt>
                <dd className="text-gray-900">
                  {profile.emailVerified ? "Yes" : "No"}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
