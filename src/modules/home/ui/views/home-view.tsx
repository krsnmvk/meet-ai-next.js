'use client';

import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';

export default function HomeView() {
  const router = useRouter();

  const { data } = authClient.useSession();

  return (
    <div className="flex flex-col gap-y-3 p-5">
      <h1>Name: {data?.user?.name}</h1>
      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: { onSuccess: () => router.push('/sign-in') },
          })
        }
      >
        Logout
      </Button>
    </div>
  );
}
