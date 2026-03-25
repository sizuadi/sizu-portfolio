import { useState } from "react";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ShowMoreButton } from "@/components/ui/ShowMoreButton";
import type { PortfolioData } from "@/types/portfolio";

const INITIAL_COUNT = 4;

export function ProjectsSection({ data }: { data: PortfolioData }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? data.projects : data.projects.slice(0, INITIAL_COUNT);
  const hasMore = data.projects.length > INITIAL_COUNT;

  return (
    <section id="projects" className="border-t border-neutral-200 dark:border-white/10">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <SectionHeading>Projects</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {visible.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>
        {hasMore && (
          <ShowMoreButton
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            showLabel="View All Projects"
            hideLabel="Show Less"
          />
        )}
      </div>
    </section>
  );
}
