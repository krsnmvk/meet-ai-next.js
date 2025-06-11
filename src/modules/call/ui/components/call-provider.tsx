'use client';

import { authClient } from '@/lib/auth-client';
import { Loader2Icon } from 'lucide-react';
import CallConnect from './call-connect';
import { GeneratedAvatarUri } from '@/lib/generated-avatar-uri';

type Props = {
  meetingId: string;
  meetingName: string;
};

export default function CallProvider({ meetingId, meetingName }: Props) {
  const { data, isPending } = authClient.useSession();

  if (!data || isPending) {
    return (
      <div className="h-screen flex items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <Loader2Icon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <>
      <CallConnect
        meetingId={meetingId}
        meetingName={meetingName}
        userId={data.user.id}
        userImage={
          data.user.image ??
          GeneratedAvatarUri({
            seed: data.user.name,
            variant: 'initials',
          })
        }
        userName={data.user.name}
      />
    </>
  );
}
