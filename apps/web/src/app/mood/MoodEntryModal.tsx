"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Modal, Textarea, useToast } from "@/components/ui";
import { createMoodEntry, DuplicateMoodEntryError, type MoodValue } from "@/lib/api";
import { MOOD_LABELS, MOOD_OPTIONS } from "./moodDisplay";

interface MoodEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string; // YYYY-MM-DD
  monthKey: string; // YYYY-MM — which cached query to invalidate on success
}

export function MoodEntryModal({ open, onOpenChange, date, monthKey }: MoodEntryModalProps) {
  const [mood, setMood] = useState<MoodValue>("neutral");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // NOTE: not mocked — this still calls the real API even under
  // NEXT_PUBLIC_MOCK_MODE=true (out of scope for the mock-mode retrofit,
  // which only covered the initial/populated calendar view). Flagging per
  // ground rule 3 rather than silently mocking further.
  const mutation = useMutation({
    mutationFn: () => createMoodEntry({ date, mood, note: note || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mood-entries", monthKey] });
      showToast({ title: "Mood logged", tone: "success" });
      setNote("");
      setError(null);
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      // DuplicateMoodEntryError gets its own message from the API (409);
      // anything else falls back to a generic retry-worthy message. Either
      // way this never assumes the calendar UI alone prevents duplicates —
      // the modal handles the API's answer directly.
      if (err instanceof DuplicateMoodEntryError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong — try again.");
      }
    },
  });

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={`Log your mood — ${date}`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map((option) => (
            <Button
              key={option}
              type="button"
              variant={mood === option ? "primary" : "outline"}
              size="sm"
              onClick={() => setMood(option)}
            >
              {MOOD_LABELS[option]}
            </Button>
          ))}
        </div>

        <Textarea
          placeholder="Anything you'd like to reflect on? (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {error && (
          <p className="text-sm text-brick-600" role="alert">
            {error}
          </p>
        )}

        <Button onClick={() => mutation.mutate()} isLoading={mutation.isPending} disabled={mutation.isPending}>
          Save
        </Button>
      </div>
    </Modal>
  );
}
