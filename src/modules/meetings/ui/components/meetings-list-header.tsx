'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon, XCircleIcon } from 'lucide-react';
import NewMeetingDialog from './new-meeting-dialog';
import { useState } from 'react';
import MeetingsSearchFilter from './meetings-search-filter';
import StatusFilter from './status-filter';
import AgentIdFilter from './agent-id-filter';
import { useMeetingssFilters } from '../../nuqs/use-meetings-filters';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function MeetingsListHeader() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useMeetingssFilters();

  const isAnyFiltersModified =
    !!filters.status || !!filters.search || !!filters.agentId;

  function onClearFilters() {
    setFilters({
      agentId: '',
      page: 1,
      search: '',
      status: null,
    });
  }

  return (
    <>
      <NewMeetingDialog onOpenChange={setOpen} open={open} />
      <div className="p-4 md-px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My Meetings</h5>
          <Button type="button" onClick={() => setOpen(true)}>
            <PlusIcon className="size-4" />
            <span>New Meeting</span>
          </Button>
        </div>
        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentIdFilter />
            {isAnyFiltersModified && (
              <Button
                type="button"
                onClick={onClearFilters}
                variant="destructive"
                size="sm"
              >
                <XCircleIcon className="size-4" />
                <span>Clear</span>
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}
