import { motion } from "motion/react";
import { Mail } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

export function ContactSection({ email }: { email: string }) {
  return (
    <section id="contact" className="border-t border-neutral-200 dark:border-white/10">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <motion.div {...fadeUp}>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold tracking-tight mb-4 text-neutral-900 dark:text-white">
            Get in Touch
          </h2>
          <p className="text-[0.9375rem] text-neutral-500 dark:text-white/50 mb-7 leading-relaxed">
            Interested in working together? Feel free to reach out.
          </p>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 border border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold text-sm no-underline transition-all duration-300 hover:bg-transparent hover:text-neutral-900 dark:hover:bg-transparent dark:hover:text-white"
          >
            <Mail size={16} />
            Say Hello
          </a>
        </motion.div>
      </div>
    </section>
  );
}
