'use client';

import { Button } from '@/components/ui/button';

import { useSidebar } from '@/components/ui/sidebar';

import { PanelLeftClose, PanelLeftIcon, SearchIcon } from 'lucide-react';

import DashboardCommand from './dashboard-command';

import { useEffect, useState } from 'react';

export default function DashboardNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { isMobile, state, toggleSidebar } = useSidebar();

  useEffect(() => {
    function down(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    }

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <DashboardCommand isOpen={isOpen} setIsOpen={setIsOpen} />
      <nav className="flex items-center gap-x-2 px-4 py-3 border-b bg-background">
        <Button
          type="button"
          onClick={toggleSidebar}
          variant="outline"
          size="sm"
        >
          {state === 'collapsed' || isMobile ? (
            <PanelLeftIcon className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </Button>
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="w-60 text-muted-foreground hover:text-muted-foreground font-normal justify-start"
        >
          <SearchIcon className="size-4" />
          <span>Search</span>
          <kbd className="ml-auto inline-flex pointer-events-none bg-muted text-muted-foreground border rounded items-center gap-1.5 p-1 font-mono font-medium text-[10px]">
            <span>&#8984;</span>
            <span>K</span>
          </kbd>
        </Button>
      </nav>
    </>
  );
}
