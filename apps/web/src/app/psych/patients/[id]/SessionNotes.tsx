"use client";

import { useEffect, useState } from "react";
import { Button, Card, Textarea, useToast } from "@/components/ui";

const STORAGE_PREFIX = "bm_psych_notes_";

function storageKey(patientId: number): string {
  return `${STORAGE_PREFIX}${patientId}`;
}

// Private session notes (docs/role-based-system-plan.md §3). Prototype: kept
// in localStorage per patient so a note survives reload during a demo; the
// real version is a psychologist-only endpoint the patient can never read.
export function SessionNotes({ patientId }: { patientId: number }) {
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey(patientId)) ?? "";
      setDraft(stored);
      setSaved(stored);
    } catch {
      // storage unavailable — notes stay in memory for this visit
    }
  }, [patientId]);

  function handleSave() {
    try {
      window.localStorage.setItem(storageKey(patientId), draft);
    } catch {
      // best-effort only
    }
    setSaved(draft);
    showToast({ title: "Note saved", description: "Only you can see session notes.", tone: "success" });
  }

  const isDirty = draft !== saved;

  return (
    <Card className="grid gap-3">
      <div>
        <h3 className="font-display text-base font-medium text-stone-900">Session notes</h3>
        <p className="text-sm text-stone-600">Private to you. Never shown to the patient.</p>
      </div>
      <Textarea
        aria-label="Session notes"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="What stood out, what to revisit next time…"
        className="rounded-md border-[1.5px] border-stone-200 px-3.5 py-3 text-[15px] leading-relaxed"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-stone-600">{isDirty ? "Unsaved changes" : saved ? "Saved" : ""}</span>
        <Button variant="outline" size="sm" onClick={handleSave} disabled={!isDirty}>
          Save note
        </Button>
      </div>
    </Card>
  );
}
