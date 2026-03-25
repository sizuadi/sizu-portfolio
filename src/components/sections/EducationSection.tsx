import { motion } from "motion/react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import type { PortfolioData } from "@/types/portfolio";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

export function EducationSection({ data }: { data: PortfolioData }) {
  return (
    <section id="education" className="border-t border-neutral-200 dark:border-white/10">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <SectionHeading>Education</SectionHeading>
        <div className="flex flex-col gap-8">
          {data.education.map((edu, i) => (
            <motion.div
              key={edu.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
            >
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                {edu.degree}
                <span className="text-neutral-400 dark:text-white/50 font-normal"> at </span>
                {edu.institution}
              </h3>
              <span className="block text-[0.8125rem] text-neutral-400 dark:text-white/50 mb-2.5">
                {edu.period}
              </span>
              <p className="text-sm leading-7 text-neutral-600 dark:text-white/70">
                {edu.description}
              </p>
              {edu.achievements && edu.achievements.length > 0 && (
                <ul className="pl-[18px] mt-2.5">
                  {edu.achievements.map((a, j) => (
                    <li
                      key={j}
                      className="text-[0.8125rem] leading-relaxed text-neutral-500 dark:text-white/50 mb-1 list-disc"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
