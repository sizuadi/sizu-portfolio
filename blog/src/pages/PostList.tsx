import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getPosts, getAllTags, type PostSummary } from "../lib/api";

export function PostList() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const activeTag = searchParams.get("tag") || "";
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    getAllTags().then((res) => { if (res.success) setTags(res.data ?? []); });
  }, []);

  useEffect(() => {
    setLoading(true);
    getPosts(page, limit, activeTag).then((res) => {
      if (res.success && res.data) {
        setPosts(res.data.posts);
        setTotal(res.data.total);
      }
      setLoading(false);
    });
  }, [page, activeTag]);

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    setSearchParams(params);
    window.scrollTo(0, 0);
  };

  const setTag = (tag: string) => {
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Blog
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">
          Thoughts on engineering, design, and building things.
        </p>

        {/* Tags Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setTag("")}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              !activeTag
                ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
                : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400"
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTag(tag)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                activeTag === tag
                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
                  : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-3 border-b border-neutral-100 dark:border-neutral-800 pb-6">
                <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-full" />
                <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-neutral-400">No posts found.</p>
        ) : (
          <div className="space-y-10">
            {posts.map((post) => (
              <article key={post.id} className="border-b border-neutral-100 dark:border-neutral-800 pb-8">
                <Link to={`/post/${post.slug}`} className="group">
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-neutral-400 dark:text-neutral-500">
                    <time>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                    <span>·</span>
                    <span>{post.readTime}</span>
                    {post.tags.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="flex gap-1.5">
                          {post.tags.map((t) => (
                            <span key={t} className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full text-xs">{t}</span>
                          ))}
                        </span>
                      </>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
            >
              ← Prev
            </button>
            <span className="text-sm text-neutral-400 dark:text-neutral-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
