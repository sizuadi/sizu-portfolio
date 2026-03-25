const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "Posts", href: "#posts" },
  { label: "Education", href: "#education" },
];

export function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-neutral-200 dark:border-white/10 mx-auto max-w-3xl px-6 py-7 flex flex-wrap justify-center gap-6">
      <div className="flex gap-5">
        {NAV_ITEMS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="text-xs text-neutral-400 dark:text-white/50 no-underline transition-colors duration-200 hover:text-neutral-900 dark:hover:text-white"
          >
            {l.label}
          </a>
        ))}
      </div>
      <p className="text-[0.6875rem] text-neutral-400 dark:text-white/50 tracking-wide">
        © {new Date().getFullYear()} {name}. All rights reserved.
      </p>
    </footer>
  );
}
