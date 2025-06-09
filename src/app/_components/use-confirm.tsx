'use client';

import { useState } from 'react';
import ResponsiveDialog from './responsive-dialog';
import { Button } from '@/components/ui/button';

type Props = {
  title: string;
  description: string;
};

export function useConfirm({ description, title }: Props) {
  const [isPromise, setIsPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  function confirm() {
    return new Promise((resolve) => setIsPromise({ resolve }));
  }

  function closeHandler() {
    setIsPromise(null);
  }

  function confirmHandler() {
    isPromise?.resolve(true);
    closeHandler();
  }

  function cancelHandler() {
    isPromise?.resolve(false);
    closeHandler();
  }

  function ConfirmationDIalog() {
    return (
      <ResponsiveDialog
        title={title}
        description={description}
        open={isPromise !== null}
        onOpenChange={closeHandler}
      >
        <div className="pt-4 w-full flex items-center justify-end gap-x-2 gap-y-2 flex-col-reverse lg:flex-row">
          <Button
            type="button"
            onClick={cancelHandler}
            variant="destructive"
            className="w-full lg:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={confirmHandler}
            className="w-full lg:w-auto"
          >
            Confirm
          </Button>
        </div>
      </ResponsiveDialog>
    );
  }

  return { confirm, ConfirmationDIalog };
}
