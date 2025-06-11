'use client';

import { Button } from '@/components/ui/button';
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';

type Props = {
  options: Array<{
    id: string;
    value: string;
    children: Readonly<React.ReactNode>;
  }>;
  value: string;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
  onSelect?: (value: string) => void;
  onSearch?: (value: string) => void;
};

export default function CommandSelect({
  options,
  value,
  className,
  onSearch,
  onSelect,
  placeholder = 'Select on option',
}: Props) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        variant="outline"
        className={cn(
          'h-9 justify-between font-medium px-2',
          !selectedOption && 'text-muted-foreground',
          className
        )}
      >
        <span>{selectedOption?.children ?? placeholder}</span>
        <ChevronsUpDownIcon />
      </Button>
      <CommandResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        shouldFilter={!onSearch}
      >
        <CommandInput placeholder="Search..." onValueChange={onSearch} />
        <CommandList>
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No options found
            </span>
          </CommandEmpty>
          {options.map(({ children, id, value }) => (
            <CommandItem
              key={id}
              onSelect={() => {
                onSelect?.(value);
                setOpen(false);
              }}
            >
              {children}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
}
