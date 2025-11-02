import { type Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Sessions',
  description: 'Manage your prioritization sessions',
};

export default function SessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <main className="min-h-screen bg-slate-50">
      {children}
    </main>
  );
}