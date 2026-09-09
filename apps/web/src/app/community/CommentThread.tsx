"use client";

import { useState, type FormEvent } from "react";
import { Avatar, Button, Disclosure, Textarea } from "@/components/ui";
import { MOCK_CURRENT_USER, createLocalId, type Comment } from "@/lib/mock/community";
import { VoteButton } from "./VoteButton";
import { formatRelativeTime } from "./relativeTime";

const MAX_COMMENT_LENGTH = 500;

export interface CommentThreadProps {
  postId: number;
  initialComments: readonly Comment[];
}

// Expand/collapse comes entirely from the shared Disclosure (Radix
// Collapsible) — no bespoke toggle state here. The soft fade-in is the
// `animate-in` keyframe Disclosure already references (defined in
// tailwind.config.ts), not a display:none/block flip.
//
// `initialComments` is a mount-once snapshot: local replies are appended to
// state and the prop is not re-read. If this is ever fed changing data (a
// refetch, a real optimistic update), remount it with a `key` rather than
// expecting prop changes to flow through.
export function CommentThread({ postId, initialComments }: CommentThreadProps) {
  const [comments, setComments] = useState<readonly Comment[]>(initialComments);
  const [draft, setDraft] = useState("");

  const replyLabel =
    comments.length === 0
      ? "Be the first to reply"
      : `${comments.length} ${comments.length === 1 ? "reply" : "replies"}`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;

    // Local-only append (prototype). The real POST /api/v2/comments/ goes here.
    const next: Comment = {
      id: createLocalId(),
      postId,
      author: MOCK_CURRENT_USER,
      content,
      timestamp: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
    };
    setComments((current) => [...current, next]);
    setDraft("");
  }

  return (
    <Disclosure
      className="border-t border-stone-200 pt-1"
      trigger={<span className="text-stone-700">{replyLabel}</span>}
    >
      <div className="space-y-4 pb-2 pt-1">
        {comments.length > 0 && (
          <ol className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id}>
                <CommentItem comment={comment} />
              </li>
            ))}
          </ol>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label htmlFor={`reply-${postId}`} className="sr-only">
            Reply as {MOCK_CURRENT_USER.displayName}
          </label>
          <Textarea
            id={`reply-${postId}`}
            value={draft}
            maxLength={MAX_COMMENT_LENGTH}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={`Reply as ${MOCK_CURRENT_USER.displayName}…`}
            className="min-h-[72px]"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-stone-600">Replies show your display name, never your real name.</p>
            <Button type="submit" size="sm" variant="secondary" disabled={!draft.trim()}>
              Reply
            </Button>
          </div>
        </form>
      </div>
    </Disclosure>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <article className="flex gap-3">
      <Avatar name={comment.author.displayName} imageUrl={comment.author.imageUrl} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 text-xs text-stone-600">
          <span className="font-medium text-stone-800">{comment.author.displayName}</span>
          <time dateTime={comment.timestamp} suppressHydrationWarning>
            {formatRelativeTime(comment.timestamp)}
          </time>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-stone-800">{comment.content}</p>
        <div className="mt-2">
          <VoteButton targetId={comment.id} targetType="comment" votes={comment.upvotes} size="sm" />
        </div>
      </div>
    </article>
  );
}
