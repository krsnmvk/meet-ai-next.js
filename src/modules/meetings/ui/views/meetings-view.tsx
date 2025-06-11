'use client';

import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import LoadingState from '@/app/_components/loading-state';
import ErrorState from '@/app/_components/error.state';
import { DataTable } from '@/app/_components/data-table';
import { columns } from '../components/column';
import EmptyState from '@/app/_components/empty.state';
import { useMeetingssFilters } from '../../nuqs/use-meetings-filters';
import DataPagination from '@/app/_components/data-pagination';
import { useRouter } from 'next/navigation';

export default function MeetingsView() {
  const [filters, setFilters] = useMeetingssFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({ ...filters })
  );

  const router = useRouter();

  return (
    <div className="flex flex-1 pb-4 px-4 md:px-8 gap-y-4 flex-col">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => router.push(`/meetings/${row.id}`)}
      />
      <DataPagination
        onPageChange={(page) => setFilters({ page })}
        page={filters.page}
        totalPages={data.totalPages}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first Meeting"
          description="Schedule a meeting to connect with others. Each meeting let's you collaborate, share ideas, and interact with participants in real time"
        />
      )}
    </div>
  );
}

export function MeetingsViewLoading() {
  return (
    <LoadingState
      title="Loading Meetings"
      description="This may take a few seconds"
    />
  );
}

export function MeetingsViewError() {
  return (
    <ErrorState title="Error Meetings" description="Please try again later" />
  );
}
