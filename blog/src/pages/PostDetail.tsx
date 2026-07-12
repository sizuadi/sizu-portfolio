import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import hljs from "highlight.js";
import { marked } from "marked";
import { getPostBySlug, type PostDetail } from "../lib/api";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

// Auto-convert Markdown jika konten lama
function isMarkdown(str: string): boolean {
  if (!str) return false;
  if (str.trimStart().startsWith("<")) return false;
  return /^#{1,6}\s|^\*\*|`[^`]|^\s*[-*+]\s|^\s*\d+\.\s/m.test(str);
}

export function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug).then((res) => {
      if (res.success && res.data) setPost(res.data);
      setLoading(false);
    });
  }, [slug]);

  // Convert + highlight
  useEffect(() => {
    if (!post?.content) return;
    const content = post.content;
    const final = isMarkdown(content) ? marked(content) as string : content;
    setHtml(final);
  }, [post?.content]);

  // Highlight setelah HTML dirender
  useEffect(() => {
    if (!html) return;
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [html]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-950 gap-4">
        <p className="text-neutral-400">Post not found.</p>
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline">← Back to blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans">
      <div className="mx-auto max-w-3xl px-6 py-20">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400 dark:text-neutral-500">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {post.readTime}
            </span>
            {post.tags.length > 0 && (
              <>
                <span>·</span>
                <span className="flex gap-1.5">
                  {post.tags.map((t) => (
                    <span key={t} className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full text-xs">
                      {t}
                    </span>
                  ))}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <article
          className="prose prose-neutral prose-lg dark:prose-invert max-w-none
            prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl
            prose-pre:bg-neutral-950 prose-pre:text-neutral-100 prose-pre:rounded-xl prose-pre:px-6 prose-pre:py-4
            prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-img:rounded-xl prose-a:text-indigo-600 dark:prose-a:text-indigo-400"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Footer */}
        <hr className="border-neutral-100 dark:border-neutral-800 mt-16 mb-8" />
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> More articles
        </Link>
      </div>
    </div>
  );
}
