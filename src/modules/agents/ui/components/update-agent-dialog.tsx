import ResponsiveDialog from '@/app/_components/responsive-dialog';
import AgentForm from './agent-form';
import { AgentGetOne } from '../../types';

type Props = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  initialValues: AgentGetOne;
};

export default function UpdateAgentDialog({
  initialValues,
  onOpenChange,
  open,
}: Props) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Update Agent"
      description="Edit the Agent details"
    >
      <AgentForm
        onCancel={() => onOpenChange(false)}
        onSuccess={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
}
