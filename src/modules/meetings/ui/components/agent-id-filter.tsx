'use client';

import { useState } from 'react';
import { useMeetingssFilters } from '../../nuqs/use-meetings-filters';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { MAX_PAGE_SIZE } from '@/constants';
import CommandSelect from '@/app/_components/command-select';
import GeneratedAvatar from '@/app/_components/generated-avatar';

export default function AgentIdFilter() {
  const [agentSearch, setAgentSearch] = useState('');
  const [filters, setFilters] = useMeetingssFilters();

  const trpc = useTRPC();
  const { data: agents } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: MAX_PAGE_SIZE,
      search: agentSearch,
    })
  );

  return (
    <CommandSelect
      options={(agents?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              seed={agent.name}
              variant="botttsNeutral"
              className="size-4"
            />
            {agent.name}
          </div>
        ),
      }))}
      placeholder="Agent"
      className="h-9"
      onSelect={(value) => setFilters({ agentId: value })}
      onSearch={setAgentSearch}
      value={filters.agentId ?? ''}
    />
  );
}
