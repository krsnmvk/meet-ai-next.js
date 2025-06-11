'use client';

import { StreamTheme, useCall } from '@stream-io/video-react-sdk';
import { useState } from 'react';
import CallLobby from './call-lobby';
import CallActive from './call-active';
import CallEnded from './call-ended';

type Props = {
  meetingName: string;
};

export default function CallUI({ meetingName }: Props) {
  const [show, setShow] = useState<'lobby' | 'ended' | 'call'>('lobby');

  const call = useCall();

  async function handleJoin() {
    if (!call) return;

    call.join();

    setShow('call');
  }

  async function handleLeave() {
    if (!call) return;

    call.endCall();

    setShow('ended');
  }

  return (
    <StreamTheme>
      {show === 'lobby' && <CallLobby onJoin={handleJoin} />}
      {show === 'call' && (
        <CallActive meetingName={meetingName} onLeave={handleLeave} />
      )}
      {show === 'ended' && <CallEnded />}
    </StreamTheme>
  );
}
