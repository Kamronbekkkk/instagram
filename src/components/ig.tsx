import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function InstagramGlyph({ className = "h-[74px] w-[74px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 74 74" className={className} role="img" aria-label="Instagram">
      <defs>
        <radialGradient id="ig-g" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285aeb" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="72" height="72" rx="20" fill="url(#ig-g)" />
      <rect x="14" y="14" width="46" height="46" rx="13" fill="none" stroke="#fff" strokeWidth="5" />
      <circle cx="37" cy="37" r="11" fill="none" stroke="#fff" strokeWidth="5" />
      <circle cx="51.5" cy="22.5" r="3.4" fill="#fff" />
    </svg>
  );
}

export function MetaGlyph({ className = "h-5 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 150" className={className} role="img" aria-label="Meta">
      <defs>
        <linearGradient id="meta-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a7dff" />
          <stop offset="45%" stopColor="#0064e0" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <path
        d="M18 75c0-28.7 22.3-52 50-52 22.2 0 36.2 12.4 46 28.4C125.5 26.7 139.5 15 162 15c27.7 0 50 23.3 50 52 0 28.7-22.3 52-50 52-22.5 0-36.5-11.7-48-28.4C104.2 115.6 90.2 128 68 128c-27.7 0-50-23.3-50-53Zm58 0c0-13.4 10.8-24 24-24 20.8 0 34.7 21 52 21 15.4 0 29.5-10.1 37-21.6 8 10.8 13.2 24 13.2 36.6 0 13.2-5.1 25.7-13.2 36.6-7.5-11.5-21.6-21.6-37-21.6-17.3 0-31.2 21-52 21-13.2 0-24-10.6-24-24Z"
        fill="none"
        stroke="url(#meta-g)"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FloatingField({
  label,
  value,
  onChange,
  type = "text",
  passwordToggle = false,
  maxLength = 255,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  passwordToggle?: boolean;
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const raised = focused || value.length > 0;

  return (
    <div
      className={`relative flex items-center rounded-[14px] border bg-field transition-colors ${
        focused ? "border-foreground/40" : "border-field-border"
      }`}
    >
      <div className="relative min-w-0 flex-1">
        <label
          className={`pointer-events-none absolute left-4 text-muted-foreground transition-all duration-150 ease-out ${
            raised ? "top-1.5 text-[11px]" : "top-1/2 -translate-y-1/2 text-[15px]"
          }`}
        >
          {label}
        </label>
        <input
          type={passwordToggle ? (show ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={maxLength}
          className="w-full bg-transparent px-4 pb-1.5 pt-5 text-[16px] text-foreground outline-none"
        />
      </div>
      {passwordToggle && (
        <button
          type="button"
          aria-label={show ? "Скрыть пароль" : "Показать пароль"}
          onClick={() => setShow((v) => !v)}
          className="pr-4 text-foreground"
        >
          {show ? <Eye className="h-6 w-6" /> : <EyeOff className="h-6 w-6" />}
        </button>
      )}
    </div>
  );
}
