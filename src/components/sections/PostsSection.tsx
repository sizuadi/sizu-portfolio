import { useState, useEffect } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { PostCard } from "@/components/ui/PostCard";
import { ShowMoreButton } from "@/components/ui/ShowMoreButton";
import { allPosts } from "@/lib/posts";
import { portfolioApiClient } from "@/lib/api";
import type { Post } from "@/types/portfolio";

const INITIAL_COUNT = 3;

interface ApiPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  published: boolean;
}

export function PostsSection() {
  const [expanded, setExpanded] = useState(false);
  // Mulai dari static posts sebagai fallback
  const [posts, setPosts] = useState<Post[]>(
    allPosts.map((p) => ({
      id: p.id,
      slug: p.slug ?? p.id,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      readTime: p.readTime,
      tags: p.tags,
    }))
  );

  // Coba fetch dari API; jika berhasil, replace posts
  useEffect(() => {
    portfolioApiClient.getPosts().then((apiPosts) => {
      if (apiPosts && Array.isArray(apiPosts) && apiPosts.length > 0) {
        setPosts(
          (apiPosts as ApiPost[]).map((p) => ({
            id: p.id,
            slug: p.slug ?? p.id,
            title: p.title,
            excerpt: p.excerpt,
            date: p.date,
            readTime: p.readTime,
            tags: p.tags,
          }))
        );
      }
    });
  }, []);

  const visible = expanded ? posts : posts.slice(0, INITIAL_COUNT);
  const hasMore = posts.length > INITIAL_COUNT;

  return (
    <section id="posts" className="border-t border-neutral-200 dark:border-white/10">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <SectionHeading>Recent Posts</SectionHeading>
        <div>
          {visible.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        {hasMore && (
          <ShowMoreButton
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            showLabel="View All Posts"
            hideLabel="Show Less"
          />
        )}
      </div>
    </section>
  );
}
