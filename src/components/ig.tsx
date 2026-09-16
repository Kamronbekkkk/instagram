import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import metaLogo from "@/images/meta-logo.png";

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

export function MetaGlyph({ className = "h-9 w-14" }: { className?: string }) {
  return (
    <img
      src={metaLogo}
      alt="Meta"
      className={className}
      role="img"
      aria-label="Meta"
      draggable={false}
    />
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
