"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button, Card, FormField, Input, Textarea, useToast } from "@/components/ui";
import { createJournalEntry, updateJournalEntry, type JournalEntry } from "@/lib/api";

interface JournalEditorProps {
  // Always the full entry (never a partial/empty shell) — JournalApp only
  // ever passes an entry already loaded from the list's real data, which
  // fixes v1's edit_journal bug where the form didn't repopulate on GET.
  entry?: JournalEntry;
  onDone: () => void;
}

function draftKey(entryId?: number): string {
  return `journal-draft-${entryId ?? "new"}`;
}

export function JournalEditor({ entry, onDone }: JournalEditorProps) {
  const key = draftKey(entry?.id);

  const [title, setTitle] = useState(() => loadDraft(key)?.title ?? entry?.title ?? "");
  const [content, setContent] = useState(() => loadDraft(key)?.content ?? entry?.content ?? "");

  const isDirty = title !== (entry?.title ?? "") || content !== (entry?.content ?? "");

  // Autosave the draft locally every few seconds — so navigating away (or a
  // crash) never loses what's been written, per the REDESIGN note. This is
  // separate from the explicit Save button, which persists to the API.
  useEffect(() => {
    if (!isDirty) return;
    const timer = setInterval(() => saveDraft(key, { title, content }), 3000);
    return () => clearInterval(timer);
  }, [key, title, content, isDirty]);

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // NOTE: not mocked — this still calls the real API even under
  // NEXT_PUBLIC_MOCK_MODE=true (out of scope for the mock-mode retrofit,
  // which only covered the initial/populated list view). Flagging per
  // ground rule 3 rather than silently mocking further.
  const mutation = useMutation({
    mutationFn: () =>
      entry
        ? updateJournalEntry(entry.id, { title, content })
        : createJournalEntry({ title, content }),
    onSuccess: () => {
      clearDraft(key);
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      showToast({ title: entry ? "Entry updated" : "Entry saved", tone: "success" });
      onDone();
    },
    onError: (err: unknown) => {
      showToast({
        title: "Couldn't save",
        description: err instanceof Error ? err.message : "Try again.",
        tone: "error",
      });
    },
  });

  return (
    // Warm, paper-like background for the writing surface specifically —
    // deliberately not the app's neutral stone tone here.
    <Card className="bg-clay-50">
      <div className="flex flex-col gap-4 p-2">
        <FormField label="Title" htmlFor="journal-title">
          <Input id="journal-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormField>

        {/* Distraction-free, full-bleed writing area rather than a small
            textarea in a page template. */}
        <Textarea
          className="min-h-[50vh] resize-none border-none bg-transparent text-base leading-relaxed focus:ring-0"
          placeholder="Write freely — this autosaves locally as you go."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onDone} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            isLoading={mutation.isPending}
            disabled={mutation.isPending || title.trim() === "" || content.trim() === ""}
          >
            Save
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface Draft {
  title: string;
  content: string;
}

function loadDraft(key: string): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null; // corrupt or inaccessible localStorage — fall back to entry/blank
  }
}

function saveDraft(key: string, draft: Draft): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(draft));
  } catch {
    // best-effort only — localStorage can be full or unavailable (private mode)
  }
}

function clearDraft(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
