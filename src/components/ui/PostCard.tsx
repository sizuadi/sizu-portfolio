import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import type { Post } from "@/types/portfolio";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

interface PostCardPost extends Post {
  slug: string;
}

export function PostCard({ post }: { post: PostCardPost }) {
  return (
    <motion.article {...fadeUp}>
      <Link
        to={`/post/${post.slug}`}
        className="group block border-b border-neutral-200 dark:border-white/10 py-6 first:pt-0 last:border-b-0 no-underline transition-all duration-200"
      >
        {/* Meta row */}
        <div className="flex items-center gap-4 mb-2 text-[0.75rem] text-neutral-400 dark:text-white/40">
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={12} />
            {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={12} />
            {post.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5 leading-snug group-hover:text-neutral-600 dark:group-hover:text-white/80 transition-colors duration-200">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[0.8125rem] leading-relaxed text-neutral-500 dark:text-white/50 mb-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-[0.625rem] font-semibold border border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-white/50 uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </motion.article>
  );
}
