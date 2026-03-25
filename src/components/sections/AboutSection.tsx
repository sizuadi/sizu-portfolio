import { motion } from "motion/react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import type { PortfolioData } from "@/types/portfolio";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

export function AboutSection({ data }: { data: PortfolioData }) {
  return (
    <section id="about" className="border-t border-neutral-200 dark:border-white/10">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <SectionHeading>About</SectionHeading>
        {data.about.map((p, i) => (
          <motion.p
            key={i}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.05 }}
            className="text-[0.9375rem] leading-[1.8] text-neutral-600 dark:text-white/70 mb-5"
          >
            {p}
          </motion.p>
        ))}

        {/* Skills */}
        <motion.div {...fadeUp} className="mt-7">
          <h3 className="text-[0.8125rem] font-semibold text-neutral-400 dark:text-white/50 mb-3.5 tracking-wide">
            Technologies
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <span
                key={s}
                className="px-3.5 py-1.5 text-xs font-medium border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-white transition-all duration-200 hover:border-neutral-900 dark:hover:border-white hover:bg-neutral-100 dark:hover:bg-white/5"
              >
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
