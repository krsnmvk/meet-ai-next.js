'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import NewAgentDialog from './new-agent-dialog';
import { useState } from 'react';

export default function AgentsListHeader() {
  const [open, setOpen] = useState(false);

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
      </div>
    </>
  );
}
