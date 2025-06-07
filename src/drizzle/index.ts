import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { account, session, user, verification } from '@/drizzle/schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({
  client: sql,
  schema: {
    account,
    session,
    user,
    verification,
  },
});
