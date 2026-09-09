// Prototype pivot (.references/roadmap/prototype-roadmap.MD) — static data,
// no call to GET /api/v2/spirituality-content/. Shape is
// docs/frontend-migration-plan.md module 9's SpiritualityContent, unchanged.
// FLAGGED per ground rule 3: placeholder reflective copy for layout/design
// review only — not a real content decision, and specifically not written
// to represent any particular faith tradition; a real content pass should
// decide that scope deliberately, not by default from a placeholder.

export interface SpiritualityContent {
  id: string;
  title: string;
  content: string;
}

export const SPIRITUALITY_CONTENT: SpiritualityContent[] = [
  {
    id: "a-quiet-moment",
    title: "A quiet moment",
    content:
      "Some days ask for stillness rather than solutions. Sitting with a " +
      "feeling instead of immediately trying to fix it isn't giving up on " +
      "it — it's giving yourself room to actually notice what's there.",
  },
  {
    id: "you-are-not-behind",
    title: "You are not behind",
    content:
      "Comparing your pace to everyone else's is a fast way to feel like " +
      "you're failing at something no one is actually racing. Progress that " +
      "doesn't look like anyone else's is still progress.",
  },
  {
    id: "small-things-count",
    title: "Small things count",
    content:
      "A short walk, a finished cup of tea, a message you finally sent — " +
      "none of these need to be dramatic to matter. Small, steady things add " +
      "up in a way that's easy to underestimate in the moment.",
  },
];
