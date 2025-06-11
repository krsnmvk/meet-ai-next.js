'use client';

import { useTRPC } from '@/trpc/client';
import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import CallUI from './call-ui';

type Props = {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string;
};

export default function CallConnect({
  meetingId,
  meetingName,
  userId,
  userImage,
  userName,
}: Props) {
  const [client, setClient] = useState<StreamVideoClient>();

  const trpc = useTRPC();
  const { mutateAsync: generateToken } = useMutation(
    trpc.meetings.generateToken.mutationOptions()
  );

  useEffect(() => {
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      tokenProvider: generateToken,
    });

    setClient(_client);
    return () => {
      _client.disconnectUser();
      setClient(undefined);
    };
  }, [generateToken, userId, userImage, userName]);

  const [call, setCall] = useState<Call>();

  useEffect(() => {
    if (!client) return;

    const _call = client.call('default', meetingId);

    _call.camera.disable();
    _call.microphone.disable();

    setCall(_call);

    return () => {
      if (_call.state.callingState !== CallingState.LEFT) {
        _call.endCall();
        _call.leave();
        setCall(undefined);
      }
    };
  }, [client, meetingId]);

  if (!client || !call) {
    return (
      <div className="h-screen flex items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <Loader2Icon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI meetingName={meetingName} />
      </StreamCall>
    </StreamVideo>
  );
}
