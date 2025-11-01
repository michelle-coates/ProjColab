"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/trpc/react";
import type { RegisterInput } from "@/lib/validations/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterInput>({
    email: "",
    password: "",
    name: "",
    role: "FREE",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({});

  const registerMutation = api.auth.register.useMutation({
    onSuccess: () => {
      router.push("/sign-in?registered=true");
    },
    onError: (error) => {
      setErrors({ email: error.message });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      await registerMutation.mutateAsync(formData);
    } catch (error) {
      // Error handled in onError
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof RegisterInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold text-[#1D1F21]">Create your account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
            required
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#1D1F21]">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
            placeholder="you@example.com"
            required
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-[#1D1F21]">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
            placeholder="Min. 8 characters, 1 uppercase, 1 number"
            required
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
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
          {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full rounded bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#68927f] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {registerMutation.isPending ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-[#76A99A] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
