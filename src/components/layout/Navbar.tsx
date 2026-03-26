import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Education", href: "#education" },
  { label: "Projects", href: "#projects" },
  { label: "Posts", href: "#posts" },
];

export function Navbar({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 32);

      // Determine active section for scrollspy
      const sectionIds = NAV_ITEMS.map((item) => item.href.substring(1));
      let current = "";
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust threshold (e.g. 150) to fine-tune when a section becomes active
          if (rect.top <= 150) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once to set initial active section
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300
        ${scrolled
          ? "bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-200 dark:border-white/10"
          : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
        {/* Logo */}
        <a href="#" className="text-base font-bold text-neutral-900 dark:text-white no-underline tracking-tight">
          {name.split(" ")[0]}
          <span className="text-neutral-400 dark:text-white/50 font-normal">.</span>
        </a>

        {/* Desktop links + theme toggle */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`text-sm font-medium no-underline transition-colors duration-200 hover:text-neutral-900 dark:hover:text-white ${
                activeSection === l.href.substring(1)
                  ? "text-neutral-900 dark:text-white"
                  : "text-neutral-500 dark:text-white/50"
              }`}
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            className="bg-transparent border-none text-neutral-900 dark:text-white cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-white/97 dark:bg-black/97 border-t border-neutral-200 dark:border-white/10 px-6 py-4 pb-6 flex flex-col gap-4">
          {NAV_ITEMS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-[0.9375rem] font-medium no-underline transition-colors duration-200 ${
                activeSection === l.href.substring(1)
                  ? "text-neutral-900 dark:text-white"
                  : "text-neutral-600 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
