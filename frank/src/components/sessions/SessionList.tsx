'use client';

import { type RouterOutputs } from '@/trpc/shared';
type Session = RouterOutputs['sessions']['list'][number];
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { formatDistanceToNow } from 'date-fns';
import NewSessionDialog from './NewSessionDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function SessionList() {
  const { data: sessions, isLoading } = api.sessions.list.useQuery();

  if (isLoading) {
    return <div className="text-center py-8">Loading sessions...</div>;
  }

  if (!sessions?.length) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-slate-600">No sessions found. Create your first prioritization session.</p>
        <NewSessionDialog />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Your Sessions</h2>
        <NewSessionDialog />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Improvements</TableHead>
            <TableHead>Decisions</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions?.map((session) => (
            <TableRow key={session.id}>
              <TableCell className="font-medium">{session.name}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                    session.status === 'ACTIVE'
                      ? 'bg-green-50 text-green-700'
                      : session.status === 'PAUSED'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {session.status}
                </span>
              </TableCell>
              <TableCell>{session.improvementCount}</TableCell>
              <TableCell>{session.decisionCount}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(session.updatedAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // Handle viewing session details
                    }}
                  >
                    View
                  </Button>
                  {session.status === 'ACTIVE' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Handle resuming session
                      }}
                    >
                      Resume
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}