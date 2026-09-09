"use client";

import { Avatar, Card, CardContent, CardHeader } from "@/components/ui";
import type { Comment, Post } from "@/lib/mock/community";
import { CommentThread } from "./CommentThread";
import { VoteButton } from "./VoteButton";
import { formatRelativeTime } from "./relativeTime";

export interface PostCardProps {
  post: Post;
  comments: readonly Comment[];
}

// Client component because the support reaction is optimistic (module 10
// allows either). Pseudonymous display name + initials avatar by default —
// no real names, no image unless the author chose one.
export function PostCard({ post, comments }: PostCardProps) {
  return (
    <Card className="p-0">
      <CardHeader className="mb-0 items-center px-5 pt-5">
        <div className="flex items-center gap-3">
          <Avatar name={post.author.displayName} imageUrl={post.author.imageUrl} size="md" />
          <div className="leading-tight">
            <p className="text-sm font-medium text-stone-900">{post.author.displayName}</p>
            <time dateTime={post.timestamp} className="text-xs text-stone-600" suppressHydrationWarning>
              {formatRelativeTime(post.timestamp)}
            </time>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-4 text-base leading-relaxed text-stone-800">
        <p className="whitespace-pre-line">{post.content}</p>
      </CardContent>

      <div className="flex items-center px-5 pb-3">
        <VoteButton targetId={post.id} targetType="post" votes={post.upvotes} />
      </div>

      <div className="px-5 pb-3">
        <CommentThread postId={post.id} initialComments={comments} />
      </div>
    </Card>
  );
}
