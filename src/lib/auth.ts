import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/drizzle/index';
import { account, session, user, verification } from '@/drizzle/schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      account,
      session,
      user,
      verification,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },
});
