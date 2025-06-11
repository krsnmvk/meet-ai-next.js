import { botttsNeutral, initials } from '@dicebear/collection';

import { createAvatar } from '@dicebear/core';

type Props = {
  seed: string;
  variant: 'botttsNeutral' | 'initials';
};

export function GeneratedAvatarUri({ seed, variant }: Props) {
  let avatar;

  if (variant === 'botttsNeutral') {
    avatar = createAvatar(botttsNeutral, { seed: seed });
  } else {
    avatar = createAvatar(initials, { seed, fontSize: 42, fontWeight: 500 });
  }

  return avatar.toDataUri();
}
