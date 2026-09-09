"use client";

import { useState } from "react";
import { Button, EmptyState, SkeletonCard } from "@/components/ui";
import type { Comment, Post } from "@/lib/mock/community";
import { PostCard } from "./PostCard";
import { PostComposer } from "./PostComposer";

const PAGE_SIZE = 4;
const MOCK_LOAD_DELAY_MS = 600;

export interface PostListProps {
  initialPosts: readonly Post[];
  commentsByPost: Readonly<Record<number, readonly Comment[]>>;
}

// Owns the feed state (module 10: `posts`, `isLoadingMore`). Pagination is
// mocked: the fixture is revealed one page at a time behind a short delay so
// the skeleton + "load more" affordance can be reviewed. Swap for React Query
// cursor pagination against GET /api/v2/posts/ later; the composer's onPost
// prepend becomes an optimistic cache update.
export function PostList({ initialPosts, commentsByPost }: PostListProps) {
  const [posts, setPosts] = useState<readonly Post[]>(initialPosts);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  function handlePost(post: Post) {
    setPosts((current) => [post, ...current]);
    setVisibleCount((current) => current + 1);
  }

  function loadMore() {
    setIsLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((current) => current + PAGE_SIZE);
      setIsLoadingMore(false);
    }, MOCK_LOAD_DELAY_MS);
  }

  return (
    <div className="space-y-5">
      <PostComposer onPost={handlePost} />

      {visiblePosts.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          description="Be the first to share something. Posts show your display name, not your real name."
        />
      ) : (
        <ol className="space-y-5" aria-label="Community posts">
          {visiblePosts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} comments={commentsByPost[post.id] ?? []} />
            </li>
          ))}
        </ol>
      )}

      {isLoadingMore && (
        <div className="space-y-5" aria-live="polite" aria-busy="true">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {hasMore && !isLoadingMore && (
        <div className="flex justify-center pt-1">
          <Button variant="outline" onClick={loadMore}>
            Load more posts
          </Button>
        </div>
      )}
    </div>
  );
}
