import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { FloatingField, InstagramGlyph, MetaGlyph } from "@/components/ig";
import { saveSessionUser } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Регистрация — Instagram" },
      {
        name: "description",
        content: "Создайте новый аккаунт: имя, телефон или эл. адрес и пароль.",
      },
      { property: "og:title", content: "Регистрация — Instagram" },
      {
        property: "og:description",
        content: "Создайте новый аккаунт: имя, телефон или эл. адрес и пароль.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit =
    name.trim() !== "" && contact.trim() !== "" && username.trim() !== "" && password.length >= 6;

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

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background px-6 pb-6 pt-4 font-sans">
      <Link to="/" aria-label="Назад" className="w-8 py-2 text-foreground">
        <ArrowLeft strokeWidth={2.5} className="h-6 w-6" />
      </Link>

      <div className="mt-10 flex justify-center">
        <InstagramGlyph />
      </div>

      <h1 className="mt-8 text-center text-[22px] font-semibold text-foreground">
        Создать новый аккаунт
      </h1>
      <p className="mt-2 text-center text-[14px] text-muted-foreground">
        Зарегистрируйтесь, чтобы смотреть фото и видео друзей.
      </p>

      <form
        className="mt-8 flex flex-col gap-3"
        onSubmit={async (e) => {
          e.preventDefault();

          const normalizedUsername = username.trim();
          const normalizedContact = contact.trim();

          if (normalizedUsername.length === 0 || normalizedContact.length === 0) {
            setError("Заполните все поля.");
            return;
          }

          try {
            const res = await fetch("/api/users", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                name,
                contact: normalizedContact,
                username: normalizedUsername,
                password,
              }),
            });
            const data = await res.json();
            if (!res.ok) {
              setError(data.error || "Ошибка регистрации.");
              return;
            }
            saveSessionUser(data);
            setError("");
            setIsLoading(true);
          } catch {
            setError("Ошибка подключения к серверу.");
          }
        }}
      >
        <FloatingField label="Имя и фамилия" value={name} onChange={setName} />
        <FloatingField
          label="Моб. телефон или эл. адрес"
          value={contact}
          onChange={setContact}
        />
        <FloatingField label="Имя пользователя" value={username} onChange={setUsername} />
        <FloatingField
          label="Пароль"
          value={password}
          onChange={setPassword}
          passwordToggle
          maxLength={128}
        />

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <p className="mt-1 px-1 text-center text-[12px] leading-4 text-muted-foreground">
          Регистрируясь, вы принимаете наши Условия, Политику конфиденциальности и Политику в
          отношении файлов cookie.
        </p>

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-1 rounded-full bg-[#0064e0] py-3.5 text-[16px] font-semibold text-white disabled:opacity-40"
        >
          Зарегистрироваться
        </button>
      </form>

      <div className="flex-1" />

      <Link
        to="/"
        className="mt-10 rounded-full border border-[#0064e0] py-3.5 text-center text-[16px] font-semibold text-[#0064e0]"
      >
        У вас уже есть аккаунт? Вход
      </Link>

      <div className="mt-6 flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          <MetaGlyph />
          <span className="text-[15px] font-semibold text-muted-foreground">Meta</span>
        </div>
        <p className="text-center text-[13px] leading-5 text-muted-foreground">
          Условия и правовая информация
        </p>
      </div>

      <div className="mx-auto mt-4 h-[5px] w-32 rounded-full bg-foreground/80" />
    </div>
  );
}
