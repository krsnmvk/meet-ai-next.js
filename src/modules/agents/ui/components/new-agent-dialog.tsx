import ResponsiveDialog from '@/app/_components/responsive-dialog';
import AgentForm from './agent-form';

type Props = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewAgentDialog({ onOpenChange, open }: Props) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="New Agent"
      description="Create a new Agent"
    >
      <AgentForm
        onCancel={() => onOpenChange(false)}
        onSuccess={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}
