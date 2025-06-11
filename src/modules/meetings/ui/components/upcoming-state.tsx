import EmptyState from '@/app/_components/empty.state';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BanIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  meetingId: string;
  onCancelMeeting: () => void;
  isCancelling?: boolean;
};

export default function UpcomingState({
  meetingId,
  onCancelMeeting,
  isCancelling,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-5 gap-y-8 bg-white rounded-lg">
      <EmptyState
        title="Not started yet"
        description="Once you start this meeting. a summary will appear here"
        image="/upcoming.svg"
      />
      <div className="flex lg:flex-row flex-col-reverse lg:justify-center items-center gap-2 w-full">
        <Link
          href="/meetings"
          onClick={onCancelMeeting}
          className={cn(
            buttonVariants({ variant: 'destructive' }),
            'w-full lg:w-auto',
            isCancelling && 'cursor-not-allowed'
          )}
        >
          <BanIcon />
          <span>Cancel Meeting</span>
        </Link>
        <Link
          href={`/call/${meetingId}`}
          className={cn(
            buttonVariants({ variant: 'default' }),
            'w-full lg:w-auto',
            isCancelling && 'cursor-not-allowed'
          )}
        >
          <VideoIcon />
          <span>Start Meeting</span>
        </Link>
      </div>
    </div>
  );
}
