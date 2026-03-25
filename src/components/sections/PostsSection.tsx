import { useState } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { PostCard } from "@/components/ui/PostCard";
import { ShowMoreButton } from "@/components/ui/ShowMoreButton";
import { allPosts } from "@/lib/posts";

const INITIAL_COUNT = 3;

export function PostsSection() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? allPosts : allPosts.slice(0, INITIAL_COUNT);
  const hasMore = allPosts.length > INITIAL_COUNT;

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
