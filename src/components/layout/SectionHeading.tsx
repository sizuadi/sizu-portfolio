import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      {...fadeUp}
      className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8 pb-3 border-b border-neutral-200 dark:border-white/10"
    >
      {children}
    </motion.h2>
  );
}
