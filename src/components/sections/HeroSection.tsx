import { motion } from "motion/react";
import { Github, Linkedin, Twitter, Mail, ArrowDown, FileText } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";
import { HeroScene } from "@/components/ui/HeroScene";
import type { PortfolioData } from "@/types/portfolio";

const ICON_MAP: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
};

export function HeroSection({ data }: { data: PortfolioData }) {
  return (
    <section className="relative min-h-screen flex items-center pt-[120px] pb-20 px-6 overflow-hidden">
      {/* 3D background */}
      <HeroScene />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto w-full max-w-3xl"
      >
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none tracking-tighter mb-4 text-neutral-900 dark:text-white">
          {data.name}
        </h1>
        <p className="text-base font-medium text-neutral-500 dark:text-white/50 mb-4">
          {data.title}
        </p>
        <p className="text-[1.0625rem] leading-relaxed text-neutral-600 dark:text-white/70 mb-7 max-w-xl">
          {data.tagline}
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2.5">
          <PillButton href={data.resumeLink} icon={FileText} label="Resume" />
          {data.socials.map((s) => {
            const Icon = ICON_MAP[s.icon] || Github;
            return <PillButton key={s.label} href={s.url} icon={Icon} label={s.label} />;
          })}
          <PillButton href={`mailto:${data.email}`} icon={Mail} label="Email" />
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-16 text-neutral-400 dark:text-white/50 flex items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={14} />
          </motion.div>
          <span className="text-[0.6875rem] font-medium tracking-widest uppercase">
            Scroll down
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
