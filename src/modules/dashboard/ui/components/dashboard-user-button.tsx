'use client';

import GeneratedAvatar from '@/app/_components/generated-avatar';

import { Avatar } from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useIsMobile } from '@/hooks/use-mobile';

import { authClient } from '@/lib/auth-client';

import { AvatarImage } from '@radix-ui/react-avatar';

import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function DashboardUserButton() {
  const { data, isPending } = authClient.useSession();

  const router = useRouter();

  async function onLogout() {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push('/sign-in') },
    });
  }

  const isMobile = useIsMobile();

  if (!data || isPending) return null;

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="rounded-lg border border-border/10 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 overflow-hidden">
          <Avatar>
            {data.user.image ? (
              <AvatarImage src={data.user.image} alt={data.user.name} />
            ) : (
              <GeneratedAvatar
                seed={data.user.name}
                variant="initials"
                className="size-8"
              />
            )}
          </Avatar>
          <div className="flex ml-3 flex-col gap-0.5 overflow-hidden flex-1 text-left min-w-0">
            <h4 className="text-sm truncate w-full">{data.user.name}</h4>
            <h5 className="text-xs truncate w-full">{data.user.email}</h5>
          </div>
          <ChevronDownIcon className="size-4 shrink-0" />
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-5">
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription>{data.user.email}</DrawerDescription>
          </div>
          <DrawerFooter>
            <Button type="button" variant="ghost" className="justify-between">
              <span>Billing</span>
              <CreditCardIcon className="size-4" />
            </Button>
            <Button
              type="button"
              onClick={onLogout}
              variant="ghost"
              className="justify-between"
            >
              <span>Logout</span>
              <LogOutIcon className="size-4" />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border border-border/10 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 overflow-hidden">
        <Avatar>
          {data.user.image ? (
            <AvatarImage src={data.user.image} alt={data.user.name} />
          ) : (
            <GeneratedAvatar
              seed={data.user.name}
              variant="initials"
              className="size-8"
            />
          )}
        </Avatar>
        <div className="flex ml-3 flex-col gap-0.5 overflow-hidden flex-1 text-left min-w-0">
          <h4 className="text-sm truncate w-full">{data.user.name}</h4>
          <h5 className="text-xs truncate w-full">{data.user.email}</h5>
        </div>
        <ChevronDownIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium truncate">
              {data.user.name}
            </span>
            <span className="text-xs font-medium text-muted-foreground truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
          <span>Billing</span>
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="flex items-center justify-between cursor-pointer"
        >
          <span>Logout</span>
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
