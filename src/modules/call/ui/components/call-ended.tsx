'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function CallEnded() {
  return (
    <div className="flex flex-col items-center justify-center bg-radial from-sidebar-accent to-sidebar h-screen">
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background p-10 shadow-sm rounded-lg">
          <div className="flex flex-col gap-y-2 text-center">
            <h5 className="text-lg font-medium">You have ended the call</h5>
            <p className="text-sm">Summary will appear in a few minutes</p>
          </div>
          <div className="flex items-center w-full justify-center">
            <Link
              href="/meetings"
              className={cn(buttonVariants({ variant: 'destructive' }))}
            >
              <span>Back to Meetings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
