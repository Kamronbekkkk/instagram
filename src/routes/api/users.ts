import { createFileRoute } from '@tanstack/react-router';
import { createUser, getAllUsers, userExists } from '@/lib/database';

export const Route = createFileRoute('/api/users')({
  server: {
    handlers: {
      GET: async () => {
        const users = getAllUsers();
        return new Response(JSON.stringify(users), {
          headers: { 'content-type': 'application/json' },
        });
      },
      POST: async ({ request }: { request: Request }) => {
        let body: Record<string, string>;
        try {
          body = await request.json();
        } catch {
          return new Response(
            JSON.stringify({ error: 'Неверный формат данных' }),
            {
              status: 400,
              headers: { 'content-type': 'application/json' },
            },
          );
        }

        const { name, contact, username, password } = body;

        if (!name?.trim() || !contact?.trim() || !username?.trim() || !password) {
          return new Response(
            JSON.stringify({ error: 'Заполните все поля.' }),
            {
              status: 400,
              headers: { 'content-type': 'application/json' },
            },
          );
        }

        if (password.length < 6) {
          return new Response(
            JSON.stringify({ error: 'Пароль должен быть не менее 6 символов.' }),
            {
              status: 400,
              headers: { 'content-type': 'application/json' },
            },
          );
        }

        if (userExists(username.trim(), contact.trim())) {
          return new Response(
            JSON.stringify({ error: 'Пользователь с таким логином или контактом уже существует.' }),
            {
              status: 409,
              headers: { 'content-type': 'application/json' },
            },
          );
        }

        const newUser = createUser({
          id: crypto.randomUUID(),
          name: name.trim(),
          contact: contact.trim(),
          username: username.trim(),
          password,
        });

        return new Response(JSON.stringify(newUser), {
          headers: { 'content-type': 'application/json' },
        });
      },
    },
  },
});
