'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon, XCircleIcon } from 'lucide-react';
import NewAgentDialog from './new-agent-dialog';
import { useState } from 'react';
import AgentsSearchFilter from './agents-search-filter';
import { useAgentsFilters } from '../../nuqs/use-agents-filters';
import { DEFAULT_PAGE } from '@/constants';

export default function AgentsListHeader() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useAgentsFilters();

  const isAnyFiltersModified = !!filters.search;

  function onClearFilters() {
    setFilters({
      page: DEFAULT_PAGE,
      search: '',
    });
  }

  return (
    <>
      <NewAgentDialog onOpenChange={setOpen} open={open} />
      <div className="p-4 md-px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My Agents</h5>
          <Button type="button" onClick={() => setOpen(true)}>
            <PlusIcon className="size-4" />
            <span>New Agent</span>
          </Button>
        </div>
        <div className="flex items-center gap-x-2 p-1">
          <AgentsSearchFilter />
          {isAnyFiltersModified && (
            <Button
              type="button"
              onClick={onClearFilters}
              variant="destructive"
              size="sm"
            >
              <XCircleIcon />
              <span>Clear</span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
