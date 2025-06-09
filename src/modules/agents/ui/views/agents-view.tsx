'use client';

import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { DataTable } from '../components/data-table';
import { columns } from '../components/column';
import LoadingState from '@/app/_components/loading-state';
import ErrorState from '@/app/_components/error.state';
import EmptyState from '@/app/_components/empty.state';
import { useAgentsFilters } from '../../nuqs/use-agents-filters';
import DataPagination from '../components/data-pagination';

export default function AgentsView() {
  const [filters, setFilters] = useAgentsFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({ ...filters })
  );

  return (
    <div className="flex flex-1 pb-4 px-4 md:px-8 gap-y-4 flex-col">
      <DataTable columns={columns} data={data.items} />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first Agent"
          description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call"
        />
      )}
    </div>
  );
}

export function AgentsViewLoading() {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds"
    />
  );
}

export function AgentsViewError() {
  return (
    <ErrorState title="Error Agents" description="Please try again later" />
  );
}
