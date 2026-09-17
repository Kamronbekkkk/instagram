import { createFileRoute } from '@tanstack/react-router';
import { findUserByCredentials } from '@/lib/database';

export const Route = createFileRoute('/api/auth/login')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        let body: Record<string, string>;
        try {
          body = await request.json();
        } catch {
          return new Response(
            JSON.stringify({ error: 'Неверный логин или пароль.' }),
            {
              status: 401,
              headers: { 'content-type': 'application/json' },
            },
          );
        }

        const { username, password } = body;
        const user = findUserByCredentials(username ?? '', password ?? '');

        if (!user) {
          return new Response(
            JSON.stringify({ error: 'Неверный логин или пароль.' }),
            {
              status: 401,
              headers: { 'content-type': 'application/json' },
            },
          );
        }

        return new Response(JSON.stringify(user), {
          headers: { 'content-type': 'application/json' },
        });
      },
    },
  },
});
