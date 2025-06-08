'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import Link from 'next/link';
import Image from 'next/image';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signinSchema, SignInSchema } from '../../validation/sign-in-schema';

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

export default function SignInView() {
  const [error, setError] = useState<string | null>();
  const [isPending, setIsPending] = useState(false);
  const [isSocialPending, setSocialIsPending] = useState(false);

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();

  async function onSubmit(values: SignInSchema) {
    setError(null);
    setIsPending(true);

    await authClient.signIn.email(
      {
        email: values.email,
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

  async function onSosial(provider: 'google' | 'github') {
    setError(null);
    setSocialIsPending(true);

    await authClient.signIn.social(
      {
        provider: provider,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          setSocialIsPending(false);
        },
        onError: (err) => {
          setError(err.error.message);
          setSocialIsPending(false);
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
                  <h3 className="text-2xl font-medium">Welcome back</h3>
                  <p className="text-muted-foreground text-balance">
                    Login to your account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            disabled={isPending || isSocialPending}
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
                            disabled={isPending || isSocialPending}
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
                    disabled={isPending || isSocialPending}
                    variant="default"
                    size="lg"
                    className="w-full"
                  >
                    {isPending ? (
                      <Loader2Icon className="size-4 animate-spin text-primary-foreground" />
                    ) : (
                      'Login'
                    )}
                  </Button>
                  <div className="after:absolute relative after:border-border text-center text-sm after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:z-0">
                    <span className="bg-card px-2 text-muted-foreground z-10 relative">
                      Or continue with
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      onClick={() => onSosial('google')}
                      disabled={isPending || isSocialPending}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      <Image
                        src="/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                      />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => onSosial('github')}
                      disabled={isPending || isSocialPending}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      <Image
                        src="/github.svg"
                        alt="Github"
                        width={20}
                        height={20}
                      />
                    </Button>
                  </div>
                  <div className="flex items-center justify-center gap-x-2 text-sm">
                    <span>Don&apos;t have an account?</span>
                    <Link
                      href="/sign-up"
                      className={cn(
                        'underline underline-offset-4',
                        (isPending || isSocialPending) && 'pointer-events-none'
                      )}
                    >
                      Sign up
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
