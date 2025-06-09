'use client';

import ErrorState from '@/app/_components/error.state';
import LoadingState from '@/app/_components/loading-state';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import AgentIdViewHeader from '../components/agent-id-view-header';
import GeneratedAvatar from '@/app/_components/generated-avatar';
import { Badge } from '@/components/ui/badge';
import { VideoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useConfirm } from '@/app/_components/use-confirm';
import UpdateAgentDialog from '../components/update-agent-dialog';
import { useState } from 'react';

type Props = {
  agentId: string;
};

export default function AgentIdView({ agentId }: Props) {
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  const router = useRouter();

  const { mutateAsync: removeAgent } = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );

        router.push('/agents');
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const { ConfirmationDIalog, confirm } = useConfirm({
    description: `The following action will remove ${data.meetingCount} associated meetings`,
    title: 'Are you sure?',
  });

  async function removeAgentHandler() {
    const ok = await confirm();

    if (!ok) return;

    await removeAgent({ id: agentId });
  }

  return (
    <>
      <ConfirmationDIalog />
      <UpdateAgentDialog
        initialValues={data}
        onOpenChange={setOpen}
        open={open}
      />
      <div className="flex flex-1 pb-4 px-4 md:px-8 gap-y-4 flex-col">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setOpen(true)}
          onRemove={() => removeAgentHandler()}
        />
        <div className="bg-white rounded-lg border">
          <div className="flex flex-col col-span-5 px-4 py-5 gap-y-5">
            <div className="flex items-center gap-x-3">
              <GeneratedAvatar
                seed={data.name}
                variant="botttsNeutral"
                className="size-10"
              />
              <h3 className="text-xl font-medium">{data.name}</h3>
            </div>
            <Badge
              variant="outline"
              className="flex items-center gap-x-2 [&>svg]:size-4"
            >
              <VideoIcon className="text-blue-700" />
              <span>
                {data.meetingCount}{' '}
                {data.meetingCount === 1 ? 'meeting' : 'meetings'}
              </span>
            </Badge>
            <div className="flex flex-col gap-y-4">
              <h3 className="font-medium text-xl">Instructions</h3>
              <p className="text-neutral-800">{data.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function AgentIdViewLoading() {
  return (
    <LoadingState
      title="Loading Agent"
      description="This may take a few seconds"
    />
  );
}

export function AgentIdViewError() {
  return (
    <ErrorState title="Error Agent" description="Please try again later" />
  );
}
