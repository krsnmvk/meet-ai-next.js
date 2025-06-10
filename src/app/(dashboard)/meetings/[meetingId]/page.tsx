import { auth } from '@/lib/auth';
import { loaderSearchParams } from '@/modules/agents/nuqs/params';
import AgentsListHeader from '@/modules/agents/ui/components/agents-list-header';
import MeetingIdView, {
  MeetingIdViewError,
  MeetingIdViewLoading,
} from '@/modules/meetings/ui/views/meeting-id-view copy';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/sign-in');

  const filters = await loaderSearchParams(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({ ...filters })
  );

  return (
    <>
      <AgentsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingIdViewLoading />}>
          <ErrorBoundary fallback={<MeetingIdViewError />}>
            <MeetingIdView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
