"use client";

import { useState, type FormEvent } from "react";
import { Button, Textarea } from "@/components/ui";

// Client component (module 13): owns the draft text only. Sending is a
// local, optimistic append via onSend — ground rule 1, no POST to
// /api/v2/conversations/:partnerId/messages/ yet.
export function MessageComposer({ onSend }: { onSend: (content: string) => void }) {
  const [draft, setDraft] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setDraft("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-stone-200 p-3">
      <Textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Write a message…"
        rows={1}
        className="min-h-0 flex-1 resize-none"
        aria-label="Message"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button type="submit" size="md" disabled={!draft.trim()}>
        Send
      </Button>
    </form>
  );
}
