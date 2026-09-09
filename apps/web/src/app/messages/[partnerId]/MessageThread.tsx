"use client";

import { useState } from "react";
import { Check, CheckCheck } from "lucide-react";
import { Avatar, EmptyState, cn } from "@/components/ui";
import {
  CURRENT_USER_ID,
  type Message,
} from "@/lib/mock/conversations";
import { MessageComposer } from "./MessageComposer";
import {
  EMPTY_CONVERSATION_DESCRIPTION,
  EMPTY_CONVERSATION_TITLE,
} from "./messagesContent";

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function DeliveryIndicator({ status }: { status: Message["status"] }) {
  const Icon = status === "read" ? CheckCheck : Check;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-stone-500">
      <Icon className="h-3 w-3" aria-hidden="true" />
      {status === "read" ? "Read" : "Delivered"}
    </span>
  );
}

function MessageBubble({
  message,
  partnerName,
}: {
  message: Message;
  partnerName: string;
}) {
  const isOwn = message.senderId === CURRENT_USER_ID;

  return (
    <div className={cn("flex items-end gap-2", isOwn && "flex-row-reverse")}>
      {!isOwn && <Avatar name={partnerName} size="sm" />}
      <div className={cn("flex max-w-[75%] flex-col gap-1", isOwn && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2 text-sm",
            isOwn
              ? "rounded-br-sm bg-brand-600 text-stone-25"
              : "rounded-bl-sm border border-clay-200 bg-clay-50 text-stone-800"
          )}
        >
          {message.content}
        </div>
        <div className="flex items-center gap-2 px-1 text-[11px] text-stone-500">
          <span>{formatTime(message.timestamp)}</span>
          {isOwn && <DeliveryIndicator status={message.status} />}
        </div>
      </div>
    </div>
  );
}

// Client component (module 13) — owns `messages`/`isPolling` per the
// migration plan's state breakdown. `isPolling` stays false: the
// polling-vs-websocket decision the plan flags as open is explicitly not
// made here (ground rule 1, static prototype only), it's just kept in state
// so swapping in real live updates later doesn't change this component's
// shape.
export function MessageThread({
  partnerName,
  initialMessages,
}: {
  partnerName: string;
  initialMessages: readonly Message[];
}) {
  const [messages, setMessages] = useState<readonly Message[]>(initialMessages);
  const [isPolling] = useState(false);

  function handleSend(content: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((m) => m.id)) + 1 : 1,
        senderId: CURRENT_USER_ID,
        content,
        timestamp: new Date().toISOString(),
        status: "pending",
      },
    ]);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden" data-polling={isPolling}>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <EmptyState
            title={EMPTY_CONVERSATION_TITLE}
            description={EMPTY_CONVERSATION_DESCRIPTION}
          />
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} partnerName={partnerName} />
          ))
        )}
      </div>
      <MessageComposer onSend={handleSend} />
    </div>
  );
}
