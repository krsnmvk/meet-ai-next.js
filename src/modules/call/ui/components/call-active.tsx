'use client';

import { CallControls, SpeakerLayout } from '@stream-io/video-react-sdk';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  onLeave: () => void;
  meetingName: string;
};

export default function CallActive({ meetingName, onLeave }: Props) {
  return (
    <div className="flex flex-col p-4 h-screen justify-between text-white ">
      <div className="flex items-center bg-[#101213] gap-4 p-4 rounded-full">
        <Link
          href="/meetings"
          className="flex items-center justify-center bg-white/10 rounded-full p-1 w-fit"
        >
          <Image src="/logo.svg" alt="Logo" width={22} height={22} />
        </Link>
        <h4 className="text-base">{meetingName}</h4>
      </div>
      <SpeakerLayout />
      <div className="bg-[#101213] rounded-full px-4">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
}
