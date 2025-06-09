'use client';

import { useForm } from 'react-hook-form';
import { AgentGetOne } from '../../types';
import { agentsSchema, AgentsSchema } from '../../validation/agents-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import GeneratedAvatar from '@/app/_components/generated-avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
};

export default function AgentForm({
  initialValues,
  onCancel,
  onSuccess,
}: Props) {
  const form = useForm<AgentsSchema>({
    resolver: zodResolver(agentsSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      instructions: initialValues?.instructions ?? '',
    },
  });

  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { mutate, isPending } = useMutation(
    trpc.agents.create.mutationOptions()
  );

  const isEdit = initialValues?.id;

  function onSubmit(values: AgentsSchema) {
    if (isEdit) {
      console.log('Is EDit');
    } else {
      mutate(values, {
        onSuccess: async () => {
          if (isEdit) {
            await queryClient.invalidateQueries(
              trpc.agents.getOne.queryOptions({ id: initialValues.id })
            );
          } else {
            await queryClient.invalidateQueries(
              trpc.agents.getMany.queryOptions()
            );
          }

          onSuccess?.();
        },
        onError: (err) => toast.error(err.message),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <GeneratedAvatar
          seed={form.watch('name')}
          variant="botttsNeutral"
          className="border size-16"
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  disabled={isPending}
                  placeholder=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isPending}
                  placeholder="You are a helpful math assistant that can answer questions and help with assignments"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          {onCancel && (
            <Button
              type="button"
              onClick={() => onCancel()}
              disabled={isPending}
              variant="destructive"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending && (
              <Loader2Icon className="size-4 animate-spin text-primary-foreground" />
            )}
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
