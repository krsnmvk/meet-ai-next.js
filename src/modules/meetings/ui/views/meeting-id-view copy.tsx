'use client';

import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import LoadingState from '@/app/_components/loading-state';
import ErrorState from '@/app/_components/error.state';
import { useRouter } from 'next/navigation';

export default function MeetingIdView() {
  // const [filters, setFilters] = useAgentsFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({}));

  const router = useRouter();

  return (
    <div className="flex flex-1 pb-4 px-4 md:px-8 gap-y-4 flex-col">
      Meeting Page
    </div>
  );
}

export function MeetingIdViewLoading() {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take a few seconds"
    />
  );
}

export function MeetingIdViewError() {
  return (
    <ErrorState title="Error Meeting" description="Please try again later" />
  );
}
