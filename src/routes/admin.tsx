import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ADMIN_CREDENTIALS, AppUser, getSessionUser, saveSessionUser } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const sessionUser = getSessionUser();
  const [username, setUsername] = useState(ADMIN_CREDENTIALS.username);
  const [password, setPassword] = useState(ADMIN_CREDENTIALS.password);
  const [error, setError] = useState("");
  const [userList, setUserList] = useState<AppUser[]>([]);

  useEffect(() => {
    const refreshUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const users = await res.json();
          setUserList(users);
        }
      } catch {
        // ignore
      }
    };
    refreshUsers();

    const handleLocalEvents = () => refreshUsers();

    window.addEventListener("storage", refreshUsers);
    window.addEventListener("instaphone_users_changed", handleLocalEvents);
    window.addEventListener("instaphone_auth_changed", handleLocalEvents);

    return () => {
      window.removeEventListener("storage", refreshUsers);
      window.removeEventListener("instaphone_users_changed", handleLocalEvents);
      window.removeEventListener("instaphone_auth_changed", handleLocalEvents);
    };
  }, []);

  if (sessionUser && !sessionUser.isAdmin) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-5 bg-background px-6 text-center">
        <h1 className="text-3xl font-semibold text-foreground">Доступ запрещён</h1>
        <p className="text-muted-foreground">Эта страница доступна только администратору.</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard", replace: true })}
            className="rounded-full bg-[#0064e0] px-4 py-2 text-sm font-semibold text-white"
          >
            В кабинет
          </button>
          <button
            type="button"
            onClick={() => {
              saveSessionUser(null);
              navigate({ to: "/", replace: true });
            }}
            className="rounded-full border border-input px-4 py-2 text-sm font-semibold text-foreground"
          >
            Выйти
          </button>
        </div>
      </div>
    );
  }

  if (sessionUser && sessionUser.isAdmin) {
    return (
      <div className="mx-auto min-h-screen max-w-6xl bg-background px-6 py-10 font-sans">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Admin panel</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">Список пользователей</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              saveSessionUser(null);
              navigate({ to: "/", replace: true });
            }}
            className="rounded-full border border-input bg-background px-4 py-2 text-sm font-medium text-foreground"
          >
            Выйти
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-foreground">
              <thead className="bg-muted/40 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Имя</th>
                  <th className="px-4 py-3">Логин</th>
                  <th className="px-4 py-3">Пароль</th>
                  <th className="px-4 py-3">Контакт</th>
                  <th className="px-4 py-3">Дата</th>
                  <th className="px-4 py-3">Роль</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user: AppUser) => (
                  <tr key={user.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3 text-red-500">{user.password}</td>
                    <td className="px-4 py-3">{user.contact}</td>
                    <td className="px-4 py-3">{new Date(user.createdAt).toLocaleString("ru-RU")}</td>
                    <td className="px-4 py-3">{user.isAdmin ? "Admin" : "User"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-background px-6 py-10">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Admin access</p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">Вход в админку</h1>

          <form
            className="mt-8 space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();

              try {
                const res = await fetch("/api/auth/login", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ username, password }),
                });
                const user = await res.json();
                if (!res.ok || !user.isAdmin) {
                  setError("Неверный логин или пароль администратора.");
                  return;
                }
                saveSessionUser(user);
                navigate({ to: "/admin", replace: true });
              } catch {
                setError("Ошибка подключения к серверу.");
              }
            }}
          >
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Логин</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-foreground outline-none ring-0"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-foreground outline-none ring-0"
            />
          </label>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-full bg-[#0064e0] py-3 text-base font-semibold text-white"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
