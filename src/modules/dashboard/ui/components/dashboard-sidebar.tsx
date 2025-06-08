'use client';

import Link from 'next/link';

import Image from 'next/image';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';

import { BotIcon, StarIcon, VideoIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { usePathname } from 'next/navigation';

import UserButton from './user-button';

const firstSection = [
  { text: 'Meetings', url: '/meetings', icon: VideoIcon },
  { text: 'Agents', url: '/agents', icon: BotIcon },
];

const secondSection = [{ text: 'Upgrade', url: '/upgrade', icon: StarIcon }];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex items-center gap-x-2 px-2 pt-2">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
          <h2 className="text-2xl font-semibold text-white">Meet.AI</h2>
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
        <SidebarSeparator className="opacity-10 text-[#5d6b68]" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map(({ icon: Icon, text, url }) => (
                <SidebarMenuButton
                  asChild
                  key={text}
                  className={cn(
                    'h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5d6b68]/10 from-sidebar from-5% via-30% via-sidebar/50 to-sidebar/50',
                    pathname === url &&
                      'border-[#5d6b68]/10 bg-linear-to-r/oklch'
                  )}
                >
                  <Link href={url}>
                    <Icon className="size-5" />
                    <span className="text-sm font-medium tracking-tight">
                      {text}
                    </span>
                  </Link>
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-4 py-2">
          <SidebarSeparator className="opacity-10 text-[#5d6b68]" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map(({ icon: Icon, text, url }) => (
                <SidebarMenuButton
                  asChild
                  key={text}
                  className={cn(
                    'h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5d6b68]/10 from-sidebar from-5% via-30% via-sidebar/50 to-sidebar/50',
                    pathname === url &&
                      'border-[#5d6b68]/10 bg-linear-to-r/oklch'
                  )}
                >
                  <Link href={url}>
                    <Icon className="size-5" />
                    <span className="text-sm font-medium tracking-tight">
                      {text}
                    </span>
                  </Link>
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-white">
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
