'use client';

import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import LoadingState from '@/app/_components/loading-state';
import ErrorState from '@/app/_components/error.state';
import { useRouter } from 'next/navigation';
import MeetingIdViewHeader from '../components/meeting-id-view-header';
import { toast } from 'sonner';
import { useConfirm } from '@/app/_components/use-confirm';
import UpddateMeetingDialog from '../components/update-meeting-dialog';
import { useState } from 'react';
import UpcomingState from '../components/upcoming-state';
import ActiveState from '../components/active-state';
import CancelledState from '../components/cancelled-state';
import ProcessingState from '../components/processing-state';

type Props = {
  meetingId: string;
};

export default function MeetingIdView({ meetingId }: Props) {
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  const { mutateAsync: removeMeeting } = useMutation(
    trpc.meetings.remove.mutationOptions()
  );

  const { ConfirmationDIalog, confirm } = useConfirm({
    title: 'Are you sure?',
    description: 'The following action will remove this meeting',
  });

  const router = useRouter();

  async function onRemove() {
    const ok = await confirm();

    if (!ok) return;

    await removeMeeting(
      { id: meetingId },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(
            trpc.meetings.getMany.queryOptions({})
          );

          router.push('/meetings');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  }

  const isActive = data.status === 'active';
  const isCancelled = data.status === 'cancelled';
  const isCompleted = data.status === 'completed';
  const isProcessing = data.status === 'processing';
  const isUpcoming = data.status === 'upcoming';

  return (
    <>
      <ConfirmationDIalog />
      <UpddateMeetingDialog
        initialValues={data}
        open={open}
        onOpenChange={setOpen}
      />
      <div className="flex flex-1 pb-4 px-4 md:px-8 gap-y-4 flex-col">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setOpen(true)}
          onRemove={onRemove}
        />
        {isActive && <ActiveState meetingId={meetingId} />}
        {isCancelled && <CancelledState />}
        {isCompleted && <div>Completed</div>}
        {isProcessing && <ProcessingState />}
        {isUpcoming && (
          <UpcomingState
            meetingId={meetingId}
            onCancelMeeting={() => {}}
            isCancelling={false}
          />
        )}
      </div>
    </>
  );
}

export function MeetingIdViewLoading() {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take a few seconds"
    />
  );
}

export function MeetingIdViewError() {
  return (
    <ErrorState title="Error Meeting" description="Please try again later" />
  );
}
