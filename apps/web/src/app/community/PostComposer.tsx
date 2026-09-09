"use client";

import { useState, type FormEvent } from "react";
import { Avatar, Button, Card, Textarea, useToast } from "@/components/ui";
import { MOCK_CURRENT_USER, createLocalId, type Post } from "@/lib/mock/community";

const MAX_POST_LENGTH = 1000;

export interface PostComposerProps {
  onPost: (post: Post) => void;
}

// Local-only composer (prototype). The real POST /api/v2/posts/ replaces the
// body of handleSubmit; per module 10 it must stay a separate endpoint from
// comments — never one shared "smart" endpoint. Image upload is deferred:
// there is no upload target in the prototype, so the control is omitted
// rather than shown as a dead button.
export function PostComposer({ onPost }: PostComposerProps) {
  const [draft, setDraft] = useState("");
  const { showToast } = useToast();
  const remaining = MAX_POST_LENGTH - draft.length;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;

    onPost({
      id: createLocalId(),
      author: MOCK_CURRENT_USER,
      content,
      timestamp: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
    });
    setDraft("");
    showToast({
      title: "Shared with the community",
      description: "Prototype only — this post is not saved and will disappear on reload.",
      tone: "success",
    });
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Avatar name={MOCK_CURRENT_USER.displayName} size="md" className="mt-0.5" />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <label htmlFor="post-composer" className="sr-only">
            Share something with the community
          </label>
          <Textarea
            id="post-composer"
            value={draft}
            maxLength={MAX_POST_LENGTH}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="What is on your mind? You are posting as a display name, not your real name."
            className="min-h-[88px]"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-stone-600">
              Posting as <span className="font-medium text-stone-800">{MOCK_CURRENT_USER.displayName}</span>
              <span aria-hidden="true"> · </span>
              <span className="tabular-nums">{remaining}</span> characters left
            </p>
            <Button type="submit" size="sm" disabled={!draft.trim()}>
              Share
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
