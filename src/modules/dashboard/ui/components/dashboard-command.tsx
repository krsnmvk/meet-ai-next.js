import { CommandResponsiveDialog, CommandInput } from '@/components/ui/command';

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DashboardCommand({ isOpen, setIsOpen }: Props) {
  return (
    <CommandResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput placeholder="Find a meeting or agent" />
    </CommandResponsiveDialog>
  );
}
