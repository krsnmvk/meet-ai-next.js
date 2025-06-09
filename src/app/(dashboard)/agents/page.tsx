import ErrorState from '@/app/_components/error.state';
import LoadingState from '@/app/_components/loading-state';
import { auth } from '@/lib/auth';
import AgentsListHeader from '@/modules/agents/ui/components/agents-list-header';
import AgentsView from '@/modules/agents/ui/views/agents-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!!session) redirect('/sign-in');

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    <>
      <AgentsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense
          fallback={
            <LoadingState
              title="Loading Agents"
              description="This may take a few seconds"
            />
          }
        >
          <ErrorBoundary
            fallback={
              <ErrorState
                title="Error Agents"
                description="Please try again later"
              />
            }
          >
            <AgentsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
