'use client';

import ErrorState from '@/app/_components/error.state';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import CallProvider from '../components/call-provider';

type Props = {
  meetingId: string;
};

export default function CallView({ meetingId }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  if (data.status === 'completed') {
    return (
      <div className="h-screen flex items-center justify-center">
        <ErrorState
          title="Meeting has ended"
          description="You can no longer join this meeting"
        />
      </div>
    );
  }

  return <CallProvider meetingId={meetingId} meetingName={data.name} />;
}
