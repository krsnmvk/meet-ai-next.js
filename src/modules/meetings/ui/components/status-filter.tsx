'use client';

import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  Loader2Icon,
  VideoIcon,
} from 'lucide-react';
import { MeetingStatus } from '../../types';
import CommandSelect from '@/app/_components/command-select';
import { useMeetingssFilters } from '../../nuqs/use-meetings-filters';

const options = [
  {
    id: MeetingStatus.upcoming,
    value: MeetingStatus.upcoming,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <ClockArrowUpIcon />
        {MeetingStatus.upcoming}
      </div>
    ),
  },
  {
    id: MeetingStatus.completed,
    value: MeetingStatus.completed,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleCheckIcon />
        {MeetingStatus.completed}
      </div>
    ),
  },
  {
    id: MeetingStatus.active,
    value: MeetingStatus.active,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <VideoIcon />
        {MeetingStatus.active}
      </div>
    ),
  },
  {
    id: MeetingStatus.processing,
    value: MeetingStatus.processing,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <Loader2Icon />
        {MeetingStatus.processing}
      </div>
    ),
  },
  {
    id: MeetingStatus.cancelled,
    value: MeetingStatus.cancelled,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleXIcon />
        {MeetingStatus.cancelled}
      </div>
    ),
  },
];

export default function StatusFilter() {
  const [filters, setFilters] = useMeetingssFilters();

  return (
    <CommandSelect
      options={options}
      placeholder="Status"
      className="h-9"
      onSearch={(value) => setFilters({ status: value as MeetingStatus })}
      value={filters.status ?? ''}
    />
  );
}
