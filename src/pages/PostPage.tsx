import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getPostBySlug } from "@/lib/posts";
import { SEO } from "@/components/SEO";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

/* Custom components for ReactMarkdown — syntax-highlighted code blocks */
const markdownComponents = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code({ className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "");
    const codeString = String(children).replace(/\n$/, "");

    if (match) {
      const language = match[1];
      return (
        <div className="my-6 border border-neutral-200 dark:border-white/10 overflow-hidden">
          {/* Language label */}
          <div className="flex items-center px-4 py-2 bg-neutral-100 dark:bg-white/5 border-b border-neutral-200 dark:border-white/10">
            <span className="text-[0.6875rem] font-semibold text-neutral-500 dark:text-white/50 uppercase tracking-wider">
              {language}
            </span>
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: 0,
              border: "none",
              fontSize: "0.8125rem",
              lineHeight: "1.7",
            }}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    }

    // Inline code — no highlighting
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

export function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <SEO title="404 - Post Not Found | Sizu Dev" description="The requested post could not be found." />
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white mb-4">
            404
          </h1>
          <p className="text-neutral-500 dark:text-white/50 mb-6">
            Post not found
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-white/50 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black font-[Space_Grotesk,Inter,system-ui,sans-serif]">
      <SEO 
        title={`${post.title} | ${post.tags ? post.tags.join(', ') : 'Blog'}`}
        description={post.content.slice(0, 160).replace(/[#*`_~]/g, '') + "..."}
        type="article"
      />
      <div className="mx-auto max-w-3xl px-6 pt-24 pb-20">
        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            to="/#posts"
            className="flex items-center gap-2 text-sm font-medium text-neutral-400 dark:text-white/40 hover:text-neutral-900 dark:hover:text-white transition-colors no-underline mb-10"
          >
            <ArrowLeft size={14} />
            Back to Posts
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-[0.625rem] font-semibold border border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-white/50 uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold tracking-tight leading-tight text-neutral-900 dark:text-white mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-neutral-400 dark:text-white/40">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>
        </motion.header>

        {/* Divider */}
        <hr className="border-neutral-200 dark:border-white/10 mb-10" />

        {/* Markdown Body */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose-mono"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {post.content}
          </ReactMarkdown>
        </motion.article>

        {/* Bottom nav */}
        <hr className="border-neutral-200 dark:border-white/10 mt-16 mb-8" />
        <Link
          to="/#posts"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 dark:text-white/40 hover:text-neutral-900 dark:hover:text-white transition-colors no-underline"
        >
          <ArrowLeft size={14} />
          All Posts
        </Link>
      </div>
    </div>
  );
}
