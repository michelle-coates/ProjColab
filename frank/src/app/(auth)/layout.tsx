import "@/styles/globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F7F8] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-[#1D1F21]">Frank</h1>
          <p className="mt-2 text-sm text-gray-600">
            AI-powered product prioritization
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
