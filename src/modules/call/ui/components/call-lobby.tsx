'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { GeneratedAvatarUri } from '@/lib/generated-avatar-uri';
import { cn } from '@/lib/utils';
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from '@stream-io/video-react-sdk';
import { LogInIcon, XCircleIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  onJoin: () => void;
};

function DisableVideoPreview() {
  const { data } = authClient.useSession();

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user.name ?? '',
          image:
            data?.user.image ??
            GeneratedAvatarUri({
              seed: data?.user.name ?? '',
              variant: 'initials',
            }),
        } as StreamVideoParticipant
      }
    />
  );
}

function AllowBrowserPermissions() {
  return (
    <p className="text-sm">
      Please graant your browser a permission to access your camera and
      microphone
    </p>
  );
}

export default function CallLobby({ onJoin }: Props) {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasCameraPermission } = useCameraState();
  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();

  const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

  return (
    <div className="flex flex-col items-center justify-center bg-radial from-sidebar-accent to-sidebar h-screen">
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background p-10 shadow-sm rounded-lg">
          <div className="flex flex-col gap-y-2 text-center">
            <h5 className="text-lg font-medium">Ready for join?</h5>
            <p className="text-sm">Set up your call before joining</p>
          </div>
          <VideoPreview
            DisabledVideoPreview={
              hasBrowserMediaPermission
                ? DisableVideoPreview
                : AllowBrowserPermissions
            }
          />
          <div className="flex items-center gap-x-2">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>
          <div className="flex items-center gap-x-2 w-full justify-between">
            <Link
              href="/meetings"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'flex items-center gap-x-2'
              )}
            >
              <XCircleIcon className="size-4" />
              <span>Cancel</span>
            </Link>
            <Button type="button" onClick={onJoin}>
              <LogInIcon className="size-4" />
              <span>Join Call</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
