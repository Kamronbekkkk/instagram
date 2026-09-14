import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { getSessionUser, saveSessionUser } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const user = getSessionUser();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    saveSessionUser(null);
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col bg-background px-6 py-10 font-sans">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Instagram</p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">Личный кабинет</h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-input bg-background px-4 py-2 text-sm font-medium text-foreground"
        >
          Выйти
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Добро пожаловать, {user.name}</h2>
        <div className="mt-6 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Логин</p>
            <p className="mt-2 text-lg font-medium text-foreground">{user.username}</p>
          </div>
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Контакт</p>
            <p className="mt-2 text-lg font-medium text-foreground">{user.contact}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/"
          className="rounded-full bg-[#0064e0] px-5 py-3 text-sm font-semibold text-white"
        >
          На страницу входа
        </Link>
      </div>
    </div>
  );
}
