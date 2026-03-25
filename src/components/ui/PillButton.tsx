import type { LucideIcon } from "lucide-react";

interface PillButtonProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export function PillButton({ href, icon: Icon, label }: PillButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-300 dark:border-white/10 text-neutral-500 dark:text-white/50 text-[0.8125rem] font-medium no-underline transition-all duration-200 bg-transparent hover:border-neutral-900 dark:hover:border-white hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/4"
    >
      <Icon size={15} />
      {label}
    </a>
  );
}
