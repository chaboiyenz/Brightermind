"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { BatteryMedium, Brain, HeartPulse, MessageCircle, Moon, MoonStar, ShieldCheck, Sparkles, Users, Gauge } from "lucide-react";
import { cn } from "@/components/ui";
import { COMMUNITY_ROOMS, LEARN_TOPICS } from "./homeContent";
import { CONTAINER_CLASS, Eyebrow, SECTION_CLASS } from "./SectionHeading";

const H2_CLASS =
  "mt-3.5 font-display text-[30px] font-semibold leading-[1.12] tracking-[-0.01em] text-stone-900 sm:text-headline-lg";
const LEDE_CLASS = "mt-4 max-w-[48ch] text-base leading-[1.6] text-stone-700";

const ROOM_ICONS = [MessageCircle, MoonStar, Sparkles] as const;
const ROOM_COLORS = ["text-brand-700", "text-brand-500", "text-clay-500"] as const;
const TOPIC_ICONS = [Brain, Gauge, HeartPulse, Moon, BatteryMedium, ShieldCheck] as const;
const TOPIC_COLORS = ["text-brand-700", "text-clay-500", "text-sage-600", "text-brand-500", "text-clay-600", "text-sage-600"] as const;
const TOPIC_ICON_BACKGROUNDS = ["bg-brand-100", "bg-clay-50", "bg-sage-100", "bg-brand-50", "bg-clay-50", "bg-sage-100"] as const;
const TOPIC_DETAILS: Record<string, { detail: string; next: string }> = {
  Anxiety: {
    detail: "Anxiety can make ordinary uncertainty feel urgent. Notice the body signal first, then try one slower exhale before deciding what needs your attention.",
    next: "Try a two-minute body scan",
  },
  Stress: {
    detail: "Stress is your system preparing to meet demand. It can help in short bursts, but recovery matters when the pressure becomes constant.",
    next: "Find a small thing you can change",
  },
  "Low mood": {
    detail: "Low mood can make effort feel pointless and shrink your sense of possibility. Small routines and gentle contact count, even when motivation is missing.",
    next: "Choose one kind action for today",
  },
  Sleep: {
    detail: "Racing thoughts at night are common when the day finally goes quiet. A predictable wind-down gives your body a clearer signal that it is safe to rest.",
    next: "Build a softer bedtime routine",
  },
  Burnout: {
    detail: "Burnout is more than being tired. Rest, reduced demands, and support help restore capacity; pushing harder usually deepens the drop.",
    next: "Talk to someone before the tank is empty",
  },
  Grounding: {
    detail: "Grounding uses your senses and surroundings to create a little distance from an intense moment. It is a pause, not a way to dismiss what you feel.",
    next: "Try naming five things you can see",
  },
};

const STARTER_POSTS = [
  { author: "Anonymous Member", age: "12m ago", text: '"I closed Slack at 5:30 PM without apologizing. For the first time in months, my evenings belong to quiet tea and painting."', likes: 48 },
  { author: "Anonymous Member", age: "34m ago", text: '"Saying I do not have the emotional capacity to hold this right now" to a family member instead of automatically absorbing their panic.', likes: 29 },
];

export function CommunityLearnSection() {
  const [posts, setPosts] = useState(STARTER_POSTS);
  const [draft, setDraft] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  function sharePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setPosts((current) => [
      { author: "You, anonymously", age: "just now", text, likes: 0 },
      ...current,
    ]);
    setDraft("");
  }

  return (
    <section id="community" aria-labelledby="community-heading" className={SECTION_CLASS}>
      <div className={cn(CONTAINER_CLASS, "grid items-start gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20")}>
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <Eyebrow>Community</Eyebrow>
            <span className="flex items-center gap-1.5 text-xs font-medium text-brand-700">
              <span className="h-2 w-2 rounded-full bg-sage-600" aria-hidden="true" />
              1,420 listening
            </span>
          </div>
          <h2 id="community-heading" className={H2_CLASS}>
            You are not the only one awake at 2 a.m.
          </h2>
          <p className={LEDE_CLASS}>
            A moderated peer space for small thoughts, honest boundaries, and company when you need it.
          </p>
          <div className="mt-7 rounded-2xl border border-stone-200 bg-stone-25 p-5 shadow-float sm:p-6">
            <div className="flex items-center gap-2 rounded-full bg-sage-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-stone-800">
              <Users className="h-4 w-4 text-brand-700" aria-hidden="true" />
              Safe haven peer lounge
            </div>
            <p className="mt-4 font-display text-lg font-medium text-stone-900">Today&apos;s gentle prompt</p>
            <p className="mt-1 text-sm italic leading-relaxed text-stone-700">
              What is one gentle boundary you set this week to protect your energy?
            </p>
            <ul className="mt-4 grid gap-2.5">
              {posts.slice(0, 2).map((post) => (
                <li key={`${post.author}-${post.age}-${post.text}`} className="rounded-xl bg-stone-100 p-3.5">
                  <div className="flex items-center justify-between gap-3 text-xs text-stone-600">
                    <span>{post.author} · {post.age}</span>
                    <span aria-label={`${post.likes} likes`}>♡ {post.likes}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-stone-800">{post.text}</p>
                </li>
              ))}
            </ul>
            <form onSubmit={sharePost} className="mt-3 flex items-center gap-2 rounded-xl bg-stone-100 p-1.5">
              <label htmlFor="community-post" className="sr-only">Share an anonymous boundary or thought</label>
              <input
                id="community-post"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Share your anonymous boundary or thought..."
                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-stone-800 outline-none placeholder:text-stone-500"
              />
              <button type="submit" className="rounded-lg bg-brand-700 px-3.5 py-2 text-xs font-semibold text-on-brand transition-colors hover:bg-brand-800">
                Share
              </button>
            </form>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-stone-600">
              <span aria-hidden="true" className="mt-1 h-2 w-2 shrink-0 rounded-full border border-brand-600" />
              Strictly moderated safe space. No toxic positivity, judgment, or unsolicited medical advice.
            </p>
          </div>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {COMMUNITY_ROOMS.map((room, roomIndex) => (
              <li key={room.name}>
                <Link
                  href="/community"
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-stone-200 bg-stone-25 px-4 py-3.5 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-brand-300"
                >
                  {(() => { const Icon = ROOM_ICONS[roomIndex]; return <Icon className={cn("h-5 w-5", ROOM_COLORS[roomIndex])} aria-hidden="true" />; })()}
                  <span>
                    <span className="block text-[15px] font-semibold text-stone-900">{room.name}</span>
                    <span className="block text-[13.5px] text-stone-600">{room.description}</span>
                  </span>
                  <span className="whitespace-nowrap text-[13px] text-stone-600">Open room</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div id="learn" className="min-w-0 lg:pt-1">
          <Eyebrow>Learn</Eyebrow>
          <h2 className={H2_CLASS}>Understand what you are feeling</h2>
          <p className={LEDE_CLASS}>
            Short, plain-language explainers reviewed by psychologists. What it is, what it is
            not, and what tends to help.
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {LEARN_TOPICS.map((topic, topicIndex) => (
              <li key={topic.title} className={topic.wide ? "sm:col-span-2" : undefined}>
                <button
                  type="button"
                  aria-pressed={selectedTopic === topic.title}
                  onClick={() => setSelectedTopic((current) => current === topic.title ? null : topic.title)}
                  className={cn(
                    "grid w-full grid-cols-[auto_1fr] gap-3 rounded-xl border bg-stone-25 px-4 py-4 text-left transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-brand-300",
                    selectedTopic === topic.title ? "border-brand-400 bg-brand-50" : "border-stone-200"
                  )}
                >
                  {(() => { const Icon = TOPIC_ICONS[topicIndex]; return <span className={cn("grid h-9 w-9 place-items-center rounded-lg", TOPIC_ICON_BACKGROUNDS[topicIndex])}><Icon className={cn("h-5 w-5", TOPIC_COLORS[topicIndex])} strokeWidth={1.8} aria-hidden="true" /></span>; })()}
                  <span className="self-center text-[15px] font-semibold text-stone-900">{topic.title}</span>
                </button>
              </li>
            ))}
          </ul>
          {selectedTopic && (
            <div aria-live="polite" className="topic-panel-enter mt-3 grid gap-2.5 rounded-xl bg-stone-100 px-4 py-3.5 text-sm leading-relaxed text-stone-700">
              <p className="font-medium text-brand-700">
                {selectedTopic} · a little context
              </p>
              <p>{TOPIC_DETAILS[selectedTopic].detail}</p>
              <p className="font-semibold text-brand-700">
                {TOPIC_DETAILS[selectedTopic].next} <span aria-hidden="true">→</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
