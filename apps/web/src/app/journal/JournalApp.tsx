"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, ConfirmDialog, useToast } from "@/components/ui";
import { deleteJournalEntry, fetchJournalEntries, type JournalEntry } from "@/lib/api";
import { isMockMode } from "@/lib/mock/mockMode";
import { getMockJournalEntries } from "@/lib/mock/journalEntries";
import { JournalEditor } from "./JournalEditor";
import { JournalEntryList } from "./JournalEntryList";

interface JournalAppProps {
  initialEntries?: JournalEntry[];
}

export function JournalApp({ initialEntries }: JournalAppProps) {
  const [editingEntry, setEditingEntry] = useState<JournalEntry | "new" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<JournalEntry | null>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Mock-mode retrofit: queryFn (not just SSR initialData) has to stay
  // mock-aware too, since react-query background-refetches on mount by
  // default — without this branch that refetch would hit the real API even
  // under NEXT_PUBLIC_MOCK_MODE=true.
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["journal-entries"],
    queryFn: () => (isMockMode() ? Promise.resolve(getMockJournalEntries()) : fetchJournalEntries()),
    initialData: initialEntries,
  });

  // NOTE: create/edit/delete still call the real API even in mock mode —
  // only the initial/populated view was in scope for this retrofit. Flagging
  // per ground rule 3 rather than silently mocking further: without a
  // backend running, these actions will surface the existing error toast
  // below instead of succeeding.
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteJournalEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      showToast({ title: "Entry deleted", tone: "success" });
      setPendingDelete(null);
    },
    onError: (err: unknown) => {
      showToast({
        title: "Couldn't delete",
        description: err instanceof Error ? err.message : "Try again.",
        tone: "error",
      });
    },
  });

  if (editingEntry) {
    return (
      <JournalEditor
        entry={editingEntry === "new" ? undefined : editingEntry}
        onDone={() => setEditingEntry(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditingEntry("new")}>New entry</Button>
      </div>

      <JournalEntryList
        entries={data}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        onEdit={setEditingEntry}
        onDelete={setPendingDelete}
      />

      {/* Replaces the raw confirm() call the audit flagged for journal
          deletion (docs/frontend-migration-plan.md module 5). */}
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={`Delete "${pendingDelete?.title ?? ""}"?`}
        description="This can't be undone."
        confirmLabel="Delete"
        isDestructive
        isConfirming={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
      />
    </div>
  );
}
