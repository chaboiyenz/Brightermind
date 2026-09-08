import { EmptyState, SkeletonCard } from "@/components/ui";
import type { JournalEntry } from "@/lib/api";
import { JournalEntryCard } from "./JournalEntryCard";

interface JournalEntryListProps {
  entries: JournalEntry[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entry: JournalEntry) => void;
}

export function JournalEntryList({
  entries,
  isLoading,
  isError,
  onRetry,
  onEdit,
  onDelete,
}: JournalEntryListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3" aria-label="Loading journal entries">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Couldn't load your journal"
        description="Something went wrong loading your entries."
        action={{ label: "Retry", onClick: onRetry }}
      />
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <EmptyState
        title="No entries yet"
        description="Start writing whenever you're ready — nothing here is graded or shared."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => (
        <JournalEntryCard
          key={entry.id}
          entry={entry}
          onEdit={() => onEdit(entry)}
          onDelete={() => onDelete(entry)}
        />
      ))}
    </div>
  );
}
