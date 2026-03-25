import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { Theme } from "@/types/portfolio";

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const DEFAULT_OPTION = OPTIONS[0] as (typeof OPTIONS)[number];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = OPTIONS.find((o) => o.value === theme) ?? DEFAULT_OPTION;
  const CurrentIcon = current.icon;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change theme"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neutral-300 dark:border-white/10 text-neutral-500 dark:text-white/50 bg-transparent transition-all duration-200 hover:border-neutral-900 dark:hover:border-white hover:text-neutral-900 dark:hover:text-white cursor-pointer text-xs font-medium"
      >
        <CurrentIcon size={14} />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[140px] py-1 border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-xl dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isActive = opt.value === theme;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-[0.8125rem] font-medium transition-colors duration-150 cursor-pointer border-none bg-transparent
                  ${isActive
                    ? "text-neutral-900 dark:text-white bg-neutral-100 dark:bg-white/5"
                    : "text-neutral-500 dark:text-white/50 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/5"
                  }`}
              >
                <Icon size={14} />
                {opt.label}
                {isActive && (
                  <span className="ml-auto text-[0.625rem] text-neutral-400 dark:text-white/30">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
