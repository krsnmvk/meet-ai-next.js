'use client';

import ResponsiveDialog from '@/app/_components/responsive-dialog';
import MeetingForm from './meeting-form';
import { useRouter } from 'next/navigation';

type Props = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewMeetingDialog({ onOpenChange, open }: Props) {
  const router = useRouter();

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="New Meeting"
      description="Create a new Meeting"
    >
      <MeetingForm
        onCancel={() => onOpenChange(false)}
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
      />
    </ResponsiveDialog>
  );
}
