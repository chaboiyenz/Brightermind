// Prototype pivot (.references/roadmap/prototype-roadmap.MD) — static data,
// no calls to GET /api/v2/posts/ or /api/v2/comments/. Shapes are
// docs/frontend-migration-plan.md module 10's Post / Comment, unchanged
// (upvotes + downvotes kept on the data even though the REDESIGN UI shows a
// single "support" reaction — see VoteButton). Authors use display-name
// pseudonyms rather than real names per the module's safety design note.
// All names and post text are invented placeholders for design review only
// (ground rule 3) — none of this is real user content.

export interface UserSummary {
  id: number;
  displayName: string;
  imageUrl?: string;
}

export interface Post {
  id: number;
  author: UserSummary;
  content: string;
  // Reserved for the real API shape — not rendered or settable in the
  // prototype (no upload target exists yet).
  imageUrl?: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  // Server-side count for list views. The prototype's CommentThread derives
  // its label from the comments it actually holds, so these can drift once
  // local replies are added; reconcile when the real feed is wired.
  commentCount: number;
}

export interface Comment {
  id: number;
  postId: number;
  author: UserSummary;
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
}

// The signed-in student, as the composer would see them. Pseudonym only.
export const MOCK_CURRENT_USER: UserSummary = { id: 1, displayName: "Quiet River" };

// Ids for posts/comments created locally in the prototype. Negative and
// strictly decreasing so they can never collide with fixture or server ids
// (or with each other on a fast double submit), and are obviously unsaved.
let nextLocalId = -1;
export function createLocalId(): number {
  return nextLocalId--;
}

const AUTHORS: Record<string, UserSummary> = {
  paperBoat: { id: 2, displayName: "Paper Boat" },
  lateBloomer: { id: 3, displayName: "Late Bloomer" },
  softLantern: { id: 4, displayName: "Soft Lantern" },
  northWindow: { id: 5, displayName: "North Window" },
  mossStep: { id: 6, displayName: "Moss Step" },
  smallHours: { id: 7, displayName: "Small Hours" },
};

const MOCK_POSTS: readonly Post[] = [
  {
    id: 201,
    author: AUTHORS.paperBoat,
    content:
      "Finals week and I keep freezing up the moment I open my notes. Tried the 4-7-8 breathing from the coping section before studying tonight and actually got through two chapters. Small win, but I wanted to say it out loud somewhere.",
    timestamp: "2026-09-08T11:20:00+08:00",
    upvotes: 18,
    downvotes: 0,
    commentCount: 3,
  },
  {
    id: 202,
    author: AUTHORS.lateBloomer,
    content:
      "Does anyone else feel guilty resting on weekends? Like if I am not studying I am falling behind. Looking for how people talk themselves out of that spiral.",
    timestamp: "2026-09-08T08:05:00+08:00",
    upvotes: 27,
    downvotes: 1,
    commentCount: 2,
  },
  {
    id: 203,
    author: AUTHORS.softLantern,
    content:
      "Reminder for whoever needs it today: you are allowed to email your professor and ask for an extension. I did it last week and the world did not end. They just said okay.",
    timestamp: "2026-09-08T21:40:00+08:00",
    upvotes: 41,
    downvotes: 0,
    commentCount: 1,
  },
  {
    id: 204,
    author: AUTHORS.northWindow,
    content:
      "First time posting. I have been logging my mood for three weeks and noticed Sundays are consistently my lowest day. Not sure what to do with that information yet, but noticing it feels like a start.",
    timestamp: "2026-09-08T16:15:00+08:00",
    upvotes: 22,
    downvotes: 0,
    commentCount: 2,
  },
  {
    id: 205,
    author: AUTHORS.mossStep,
    content:
      "Started a 10-minute walk between my afternoon classes instead of scrolling. A week in and my head feels less loud by the evening. Sharing in case someone wants a low-effort thing to try.",
    timestamp: "2026-09-07T13:30:00+08:00",
    upvotes: 15,
    downvotes: 0,
    commentCount: 0,
  },
  {
    id: 206,
    author: AUTHORS.smallHours,
    content:
      "Cannot sleep before 3am lately and then I am wrecked for morning lectures. Anyone found something that actually helped with winding down, not just 'no screens'?",
    timestamp: "2026-09-06T02:50:00+08:00",
    upvotes: 9,
    downvotes: 0,
    commentCount: 1,
  },
];

const MOCK_COMMENTS: readonly Comment[] = [
  {
    id: 301,
    postId: 201,
    author: AUTHORS.lateBloomer,
    content: "Two chapters during finals week is not small. Proud of you.",
    timestamp: "2026-09-08T11:45:00+08:00",
    upvotes: 6,
    downvotes: 0,
  },
  {
    id: 302,
    postId: 201,
    author: AUTHORS.softLantern,
    content:
      "I do the breathing thing right before opening my laptop too. It helps to make it a ritual so my brain knows what is coming.",
    timestamp: "2026-09-08T12:02:00+08:00",
    upvotes: 4,
    downvotes: 0,
  },
  {
    id: 303,
    postId: 201,
    author: AUTHORS.mossStep,
    content: "Saving this for tonight. Thank you for saying it out loud.",
    timestamp: "2026-09-08T12:30:00+08:00",
    upvotes: 2,
    downvotes: 0,
  },
  {
    id: 304,
    postId: 202,
    author: AUTHORS.paperBoat,
    content:
      "What helped me was writing rest into the schedule like it was a class. If it is on the timetable it stops feeling like skipping.",
    timestamp: "2026-09-08T08:40:00+08:00",
    upvotes: 11,
    downvotes: 0,
  },
  {
    id: 305,
    postId: 202,
    author: AUTHORS.northWindow,
    content: "Following. I have the exact same spiral every Saturday.",
    timestamp: "2026-09-08T09:10:00+08:00",
    upvotes: 3,
    downvotes: 0,
  },
  {
    id: 306,
    postId: 203,
    author: AUTHORS.smallHours,
    content: "Needed this today. Drafting the email now.",
    timestamp: "2026-09-08T22:05:00+08:00",
    upvotes: 8,
    downvotes: 0,
  },
  {
    id: 307,
    postId: 204,
    author: AUTHORS.softLantern,
    content:
      "Noticing is genuinely the hard part. When I saw my pattern I started planning one small nice thing for that day, on purpose.",
    timestamp: "2026-09-08T17:00:00+08:00",
    upvotes: 7,
    downvotes: 0,
  },
  {
    id: 308,
    postId: 204,
    author: AUTHORS.paperBoat,
    content: "Welcome. Glad you posted.",
    timestamp: "2026-09-08T18:20:00+08:00",
    upvotes: 5,
    downvotes: 0,
  },
  {
    id: 309,
    postId: 206,
    author: AUTHORS.mossStep,
    content:
      "The body scan in the coping section knocked me out twice this week. Not a cure but it took the edge off the 3am thing.",
    timestamp: "2026-09-06T09:15:00+08:00",
    upvotes: 4,
    downvotes: 0,
  },
];

/**
 * Single swap point for the real fetch later (ground rule 5) — replace the
 * body with GET /api/v2/posts/ (cursor-paginated) and nothing else changes.
 * Newest first, matching what the feed endpoint will return.
 */
export function getMockPosts(): readonly Post[] {
  return [...MOCK_POSTS].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Swap point for GET /api/v2/comments/?post=<id>. Returned oldest-first so the
 * thread reads top to bottom like a conversation.
 */
export function getMockComments(postId: number): readonly Comment[] {
  return MOCK_COMMENTS.filter((comment) => comment.postId === postId);
}
