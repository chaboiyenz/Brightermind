import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { JournalEntry } from "@/lib/api";

interface JournalEntryCardProps {
  entry: JournalEntry;
  onEdit: () => void;
  onDelete: () => void;
}

export function JournalEntryCard({ entry, onEdit, onDelete }: JournalEntryCardProps) {
  const snippet =
    entry.content.length > 160 ? `${entry.content.slice(0, 160)}…` : entry.content;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{entry.title}</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{snippet}</p>
        <p className="mt-2 text-xs text-stone-600">
          Updated {new Date(entry.updated_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
