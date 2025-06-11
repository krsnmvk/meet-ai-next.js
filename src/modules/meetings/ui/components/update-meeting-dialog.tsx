'use client';

import ResponsiveDialog from '@/app/_components/responsive-dialog';
import MeetingForm from './meeting-form';
import { useRouter } from 'next/navigation';
import { MeetingGetOne } from '../../types';

type Props = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  initialValues?: MeetingGetOne;
};

export default function UpddateMeetingDialog({
  onOpenChange,
  open,
  initialValues,
}: Props) {
  const router = useRouter();

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Meeting"
      description="Edit the Meeting details"
    >
      <MeetingForm
        onCancel={() => onOpenChange(false)}
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
}
