'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { MeetingGetOne } from '../../types';
import {
  MeetingsInsertSchema,
  meetingsInsrtSchema,
} from '../../validation/meetings-schema';
import { useState } from 'react';
import { MAX_PAGE_SIZE } from '@/constants';
import CommandSelect from '@/app/_components/command-select';
import GeneratedAvatar from '@/app/_components/generated-avatar';
import NewAgentDialog from '@/modules/agents/ui/components/new-agent-dialog';

type Props = {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
};

export default function MeetingForm({
  initialValues,
  onCancel,
  onSuccess,
}: Props) {
  const [agentsSearch, setAgentsSearch] = useState('');
  const [open, setOpen] = useState(false);

  const form = useForm<MeetingsInsertSchema>({
    resolver: zodResolver(meetingsInsrtSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      agentId: initialValues?.agentId ?? '',
    },
  });

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const { data: agents } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: MAX_PAGE_SIZE,
      search: agentsSearch,
    })
  );

  const { mutate: createMeeting, isPending: isPendingCreate } = useMutation(
    trpc.meetings.create.mutationOptions()
  );

  const { mutate: updateMeeting, isPending: isPendingUpdate } = useMutation(
    trpc.meetings.update.mutationOptions()
  );

  const isEdit = initialValues?.id;

  function onSubmit(values: MeetingsInsertSchema) {
    if (isEdit) {
      updateMeeting(
        { ...values, id: initialValues.id },
        {
          onSuccess: async (data) => {
            if (isEdit) {
              await queryClient.invalidateQueries(
                trpc.meetings.getOne.queryOptions({ id: initialValues.id })
              );
            } else {
              await queryClient.invalidateQueries(
                trpc.meetings.getMany.queryOptions({})
              );
            }

            onSuccess?.(data.id);
          },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      createMeeting(values, {
        onSuccess: async (data) => {
          if (isEdit) {
            await queryClient.invalidateQueries(
              trpc.meetings.getOne.queryOptions({ id: initialValues.id })
            );
          } else {
            await queryClient.invalidateQueries(
              trpc.meetings.getMany.queryOptions({})
            );
          }

          onSuccess?.(data.id);
        },
        onError: (err) => toast.error(err.message),
      });
    }
  }

  return (
    <>
      <NewAgentDialog onOpenChange={setOpen} open={open} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    disabled={isPendingCreate || isPendingUpdate}
                    placeholder="e.g. Math Consultations"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(agents?.items ?? []).map((agent) => ({
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <GeneratedAvatar
                            seed={agent.name}
                            variant="botttsNeutral"
                            className="border size-6"
                          />
                          <span>{agent.name}</span>
                        </div>
                      ),
                    }))}
                    onSelect={field.onChange}
                    onSearch={setAgentsSearch}
                    value={field.value}
                    placeholder="Select an Agent"
                  />
                </FormControl>
                <FormDescription>
                  Not found what you&apos;re looking for?{' '}
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="text-primary hover:underline"
                  >
                    Create new Agent
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            {onCancel && (
              <Button
                type="button"
                onClick={() => onCancel()}
                disabled={isPendingCreate || isPendingUpdate}
                variant="destructive"
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isPendingCreate || isPendingUpdate}>
              {(isPendingCreate || isPendingUpdate) && (
                <Loader2Icon className="size-4 animate-spin text-primary-foreground" />
              )}
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
