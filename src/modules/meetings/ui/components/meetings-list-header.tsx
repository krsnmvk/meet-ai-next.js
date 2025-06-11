'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import NewMeetingDialog from './new-meeting-dialog';
import { useState } from 'react';

export default function MeetingsListHeader() {
  const [open, setOpen] = useState(false);

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
        <div className="flex items-center gap-x-2 p-1">TODO:</div>
      </div>
    </>
  );
}
