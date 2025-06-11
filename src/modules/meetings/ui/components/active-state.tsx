import EmptyState from '@/app/_components/empty.state';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VideoIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  meetingId: string;
};

export default function ActiveState({ meetingId }: Props) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-5 gap-y-8 bg-white rounded-lg">
      <EmptyState
        title="Meeting is active"
        description="Meeting will end once all participants have left"
        image="/upcoming.svg"
      />
      <div className="flex lg:flex-row flex-col-reverse lg:justify-center items-center gap-2 w-full">
        <Link
          href={`/call/${meetingId}`}
          className={cn(
            buttonVariants({ variant: 'default' }),
            'w-full lg:w-auto'
          )}
        >
          <VideoIcon />
          <span>Join Meeting</span>
        </Link>
      </div>
    </div>
  );
}
