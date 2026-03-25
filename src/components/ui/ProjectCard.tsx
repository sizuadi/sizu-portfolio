import { motion } from "motion/react";
import { Github, ExternalLink } from "lucide-react";
import type { PortfolioData } from "@/types/portfolio";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

export function ProjectCard({
  project,
}: {
  project: PortfolioData["projects"][number];
}) {
  return (
    <motion.article
      {...fadeUp}
      className="group flex flex-col overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#0a0a0a] transition-all duration-300 hover:border-neutral-400 dark:hover:border-white/30 hover:shadow-lg dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] hover:-translate-y-1"
    >
      {/* Image */}
      <div className="overflow-hidden aspect-16/10">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover  transition-all duration-500 group-hover:contrast-100 group-hover:scale-105 object-top"
        />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2 leading-snug">
          {project.title}
        </h3>
        <p className="text-[0.8125rem] leading-relaxed text-neutral-500 dark:text-white/50 mb-4 flex-1">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-2.5 py-0.5 text-[0.625rem] font-semibold border border-neutral-300 dark:border-white/15 text-neutral-600 dark:text-white/60 bg-transparent transition-all duration-200 hover:border-neutral-900 dark:hover:border-white hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        {(project.github || project.link) && (
          <div className="flex items-center gap-2 pt-3 border-t border-neutral-200 dark:border-white/10">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-semibold border border-neutral-300 dark:border-white/15 text-neutral-600 dark:text-white/60 bg-transparent transition-all duration-200 hover:border-neutral-900 dark:hover:border-white hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5"
              >
                <Github size={13} />
                GitHub
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-semibold border border-neutral-300 dark:border-white/15 text-neutral-600 dark:text-white/60 bg-transparent transition-all duration-200 hover:border-neutral-900 dark:hover:border-white hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5"
              >
                <ExternalLink size={13} />
                Live Demo
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
