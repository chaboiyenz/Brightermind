import { apiFetch } from "./client";

export interface ContentBlock {
  id: number;
  slug: string;
  title: string;
  content: string;
  created_at: string;
}

export async function fetchContentBlock(slug: string): Promise<ContentBlock> {
  return apiFetch<ContentBlock>(`/v2/content/${slug}/`, {
    // ISR — this is public marketing copy that rarely changes, unlike
    // mood/journal/tasks which need a live, per-user fetch every time.
    next: { revalidate: 3600 },
  });
}
