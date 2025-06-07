'use client';

import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="p-5">
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
