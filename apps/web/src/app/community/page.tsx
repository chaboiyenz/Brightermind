import { Badge } from "@/components/ui";
import { getMockComments, getMockPosts, type Comment } from "@/lib/mock/community";
import { PostList } from "./PostList";

// CommunityFeedPage (docs/frontend-migration-plan.md module 10). Server
// component that loads the initial page from the mock fixture and hands it to
// the client-side PostList. Open to every role — v1's `onlinecom` was
// student-facing and nothing here is privileged.
export default function CommunityFeedPage() {
  const posts = getMockPosts();
  const commentsByPost: Record<number, readonly Comment[]> = Object.fromEntries(
    posts.map((post) => [post.id, getMockComments(post.id)])
  );

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Community</h1>
          <Badge tone="neutral">Prototype — nothing here is saved</Badge>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          A peer-support space for students. Everyone posts under a display
          name, not a real name. Be kind, and if someone sounds like they are in
          crisis, point them to the hotlines rather than trying to handle it alone.
        </p>
      </header>

      <PostList initialPosts={posts} commentsByPost={commentsByPost} />
    </main>
  );
}
