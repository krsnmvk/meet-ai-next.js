'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import Link from 'next/link';
import Image from 'next/image';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignUpSchema } from '../../validation/sign-up-schema';

import { authClient } from '@/lib/auth-client';

import { cn } from '@/lib/utils';

import { Alert, AlertTitle } from '@/components/ui/alert';

import { Card, CardContent } from '@/components/ui/card';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

import { Loader2Icon, OctagonAlertIcon } from 'lucide-react';

export default function SignUpView() {
  const [error, setError] = useState<string | null>();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const router = useRouter();

  async function onSubmit(values: SignUpSchema) {
    setError(null);
    setIsPending(true);

    await authClient.signUp.email(
      {
        email: values.email,
        name: values.name,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push('/');
          setIsPending(false);
        },
        onError: (err) => {
          setError(err.error.message);
          setIsPending(false);
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-0 overflow-hidden">
        <CardContent className="grid md:grid-cols-2 p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-2xl font-medium">
                    Let&apos;s get started
                  </h3>
                  <p className="text-muted-foreground text-balance">
                    Create your account
                  </p>
                </div>
                <div className="grid gap-3">
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
                            placeholder="jhon example"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            disabled={isPending}
                            placeholder="jhon@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            disabled={isPending}
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            disabled={isPending}
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!!error && (
                    <Alert className="bg-destructive/10 border-none">
                      <OctagonAlertIcon className="!text-destructive" />
                      <AlertTitle className="text-destructive">
                        {error}
                      </AlertTitle>
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    disabled={isPending}
                    variant="default"
                    size="lg"
                    className="w-full"
                  >
                    {isPending ? (
                      <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
                    ) : (
                      'Sign up'
                    )}
                  </Button>
                  <div className="flex items-center justify-center gap-x-2 text-sm">
                    <span>Already have an account?</span>
                    <Link
                      href="/sign-in"
                      className={cn(
                        'underline underline-offset-4',
                        isPending && 'pointer-events-none'
                      )}
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </Form>
          <div className="bg-radial from-sidebar-accent to-sidebar md:flex flex-col items-center justify-center gap-y-4 hidden">
            <figure className="relative size-24 overflow-hidden">
              <Image src="/logo.svg" alt="Logo" fill className="object-cover" />
            </figure>
            <h2 className="text-3xl font-bold text-white">Meet.AI</h2>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-muted-foreground text-xs *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Term of Service</a>{' '}
        and <a href="#">Privasi Policy</a>
      </div>
    </div>
  );
}
