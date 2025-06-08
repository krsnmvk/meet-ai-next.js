import { redirect } from 'next/navigation';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

import HomeView from '@/modules/home/ui/views/home-view';
import { caller } from '@/trpc/server';

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { greeting } = await caller.hello({ text: 'Krisno Mukti' });

  if (!session) redirect('/sign-in');

  return (
    <div className="p-5">
      {greeting}
      <HomeView />
    </div>
  );
}
