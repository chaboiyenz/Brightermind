// Cognitive reframing rounds. Each thought has one balanced response and two
// that repeat a thinking trap. Trap names follow the common CBT list so the
// feedback teaches vocabulary a psychologist would also use. Flagged for
// clinical sign-off (prototype ground rule 3).

export type Distortion =
  | "All-or-nothing thinking"
  | "Catastrophising"
  | "Mind reading"
  | "Overgeneralising"
  | "Should statements"
  | "Fortune telling"
  | "Labelling"
  | "Personalising";

export interface ReframeOption {
  readonly text: string;
  /** Present on trap options only; the balanced option has none. */
  readonly distortion?: Distortion;
}

export interface ReframeRound {
  readonly thought: string;
  readonly balanced: string;
  readonly traps: readonly [ReframeOption, ReframeOption];
  readonly why: string;
}

export const REFRAME_ROUNDS: readonly ReframeRound[] = [
  {
    thought: "I got 6 out of 10 on the quiz. I'm going to fail the whole course.",
    balanced: "One quiz is one data point. I can see which questions I missed and adjust before the next one.",
    traps: [
      { text: "This proves I'm not cut out for this degree.", distortion: "Overgeneralising" },
      { text: "If I fail the course I'll never get a decent job.", distortion: "Catastrophising" },
    ],
    why: "A balanced thought keeps the result its real size: one quiz, fixable.",
  },
  {
    thought: "My friend read my message two hours ago and hasn't replied.",
    balanced: "There are lots of reasons people reply late. I'll wait and ask directly if it still bothers me.",
    traps: [
      { text: "They're annoyed with me and don't want to say it.", distortion: "Mind reading" },
      { text: "I always push people away eventually.", distortion: "Overgeneralising" },
    ],
    why: "You cannot read minds. The balanced version admits you do not know and plans a real check.",
  },
  {
    thought: "I froze during my presentation for a few seconds.",
    balanced: "I paused, then continued. Most people notice a pause far less than the speaker does.",
    traps: [
      { text: "The whole presentation was a disaster.", distortion: "All-or-nothing thinking" },
      { text: "I'm just a nervous person who can't present.", distortion: "Labelling" },
    ],
    why: "A few seconds does not cancel the rest. Grades are not all-or-nothing and neither are you.",
  },
  {
    thought: "I should be able to handle everything without feeling stressed.",
    balanced: "Stress is a normal response to a heavy load. I can handle things and feel stressed at the same time.",
    traps: [
      { text: "Other people cope fine, so I must be weaker than them.", distortion: "Labelling" },
      { text: "I have to stop feeling stressed before I can do anything.", distortion: "Should statements" },
    ],
    why: "'Should' turns a feeling into a failure. The balanced thought allows the feeling and keeps going.",
  },
  {
    thought: "The group project went badly. It's my fault the team got a low mark.",
    balanced: "Several things went wrong and I was one part of a team. I can own my part without carrying all of it.",
    traps: [
      { text: "If I'd worked harder none of this would have happened.", distortion: "Personalising" },
      { text: "Everyone on the team must think I dragged them down.", distortion: "Mind reading" },
    ],
    why: "Personalising makes you the single cause of a shared outcome. Balanced thinking shares the weight fairly.",
  },
  {
    thought: "I have three deadlines this week. There's no way I'll get through it.",
    balanced: "It's a heavy week. If I list the three and start with the nearest, I'll know by tonight how realistic it is.",
    traps: [
      { text: "I'm definitely going to miss at least one and that will ruin my grade.", distortion: "Fortune telling" },
      { text: "I'm hopeless at managing my time.", distortion: "Labelling" },
    ],
    why: "Fortune telling decides the outcome before it happens. The balanced thought gathers information first.",
  },
  {
    thought: "I didn't get picked for the team. Nobody wants me around.",
    balanced: "I wasn't picked this time. That's disappointing, and it's about one selection, not about me as a person.",
    traps: [
      { text: "Everyone can tell there's something wrong with me.", distortion: "Mind reading" },
      { text: "This always happens to me. I never get chosen for anything.", distortion: "Overgeneralising" },
    ],
    why: "'Nobody' and 'always' are the tells of overgeneralising. The balanced version stays specific.",
  },
  {
    thought: "My heart is racing before the exam. I'm going to have a breakdown in there.",
    balanced: "My body is gearing up, which is what nerves do. It's uncomfortable, not dangerous, and it usually eases once I start.",
    traps: [
      { text: "This means I'm not ready and I'll blank on everything.", distortion: "Fortune telling" },
      { text: "I'll faint or panic and everyone will see.", distortion: "Catastrophising" },
    ],
    why: "Catastrophising jumps to the worst outcome. The balanced thought names the sensation and its usual course.",
  },
];
