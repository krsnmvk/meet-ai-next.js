'use client';

import { ColumnDef } from '@tanstack/react-table';
import GeneratedAvatar from '@/app/_components/generated-avatar';
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  Loader2Icon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MeetingGetMany } from '../../types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/format-duration';

const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: Loader2Icon,
  processing: Loader2Icon,
  completed: CircleCheckIcon,
  cancelled: CircleXIcon,
};

const statusColorMap = {
  upcoming: 'bg-yellow-500/20 text-yellow-800 border-yellow-800/5',
  active: 'bg-blue-500/20 text-blue-800 border-blue-800/5',
  cancelled: 'bg-rose-500/20 text-rose-800 border-rose-800/5',
  completed: 'bg-emerald-500/20 text-emerald-800 border-emerald-800/5',
  processing: 'bg-gray-500/20 text-gray-800 border-gray-800/5',
};

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: 'name',
    header: 'Meeting Name',
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-medium capitalize">{row.original.name}</span>
        <div className="flex items-center gap-x-2 overflow-hidden">
          <div className="flex items-center gap-x-1">
            <CornerDownRightIcon className="text-muted-foreground size-3" />
            <p className="text-sm max-w-48 truncate text-muted-foreground">
              {row.original.name}
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              seed={row.original.name}
              variant="botttsNeutral"
              className="size-4"
            />
            <h4 className="text-sm text-muted-foreground">
              {row.original.startedAt
                ? format(row.original.startedAt, 'MMM d')
                : ''}
            </h4>
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const Icon =
        statusIconMap[row.original.status as keyof typeof statusIconMap];

      return (
        <Badge
          variant="outline"
          className={cn(
            '[&>svg]:size-4 capitalize text-muted-foreground',
            statusColorMap[row.original.status as keyof typeof statusColorMap]
          )}
        >
          <Icon
            className={cn(
              row.original.status === 'processing' && 'animate-spin'
            )}
          />
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="[&>svg]:size-4 capitalize flex items-center gap-x-2"
      >
        <ClockFadingIcon className="text-blue-700" />
        {row.original.duration
          ? formatDuration(row.original.duration)
          : 'No durations'}
      </Badge>
    ),
  },
];
