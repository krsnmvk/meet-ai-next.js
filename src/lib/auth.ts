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

  trustedOrigins: ['https://dove-calm-primate.ngrok-free.app'],

  advanced: {
    cookies: {
      session_token: {
        name: 'AUTH_TOKEN',
        attributes: {
          httpOnly: true,
          sameSite: 'Strict',
          secure: true,
          path: '/',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        },
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
