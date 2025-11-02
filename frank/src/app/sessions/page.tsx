import { type Metadata } from 'next';
import SessionList from '@/components/sessions/SessionList';

export const metadata: Metadata = {
  title: 'Sessions | ProjColab',
  description: 'Manage your prioritization sessions',
};

export default function SessionsPage() {
  return (
    <div className="container mx-auto py-10">
      <SessionList />
    </div>
  );
}