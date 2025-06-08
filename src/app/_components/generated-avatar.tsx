'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

import { botttsNeutral, initials } from '@dicebear/collection';

import { createAvatar } from '@dicebear/core';

type Props = {
  seed: string;
  variant: 'botttsNeutral' | 'initials';
  className?: string;
};

export default function GeneratedAvatar({ seed, variant, className }: Props) {
  let avatar;

  if (variant === 'botttsNeutral') {
    avatar = createAvatar(botttsNeutral, { seed: seed });
  } else {
    avatar = createAvatar(initials, { seed, fontSize: 32, fontWeight: 500 });
  }

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar.toDataUri()} alt="Avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
