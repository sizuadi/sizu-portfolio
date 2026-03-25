import { motion } from "motion/react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import type { PortfolioData } from "@/types/portfolio";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

export function WorkSection({ data }: { data: PortfolioData }) {
  return (
    <section id="work" className="border-t border-neutral-200 dark:border-white/10">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <SectionHeading>Work</SectionHeading>
        <div className="flex flex-col gap-10">
          {data.experience.map((exp, i) => (
            <motion.article
              key={exp.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
            >
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1 leading-snug">
                {exp.role}
                <span className="text-neutral-400 dark:text-white/50 font-normal"> at </span>
                {exp.company}
              </h3>
              <span className="block text-[0.8125rem] text-neutral-400 dark:text-white/50 mb-3">
                {exp.period}
              </span>
              <p className="text-sm leading-7 text-neutral-600 dark:text-white/70 mb-3">
                {exp.description}
              </p>

              <ul className="pl-[18px] m-0">
                {exp.impact.map((item, j) => (
                  <li
                    key={j}
                    className="text-[0.8125rem] leading-relaxed text-neutral-500 dark:text-white/50 mb-1 list-disc"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 mt-3.5">
                {exp.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 text-[0.625rem] font-semibold border border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-white/50 uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
