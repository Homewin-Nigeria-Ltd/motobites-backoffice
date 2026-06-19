"use client"

import { cn } from "@/lib/utils"
import { getUserInitials } from "@/utils/get-initials"
import type { ApiSupportMessage } from "../types"
import { formatChatMessageTime } from "../utils/format-chat-time"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

type ChatMessageBubbleProps = {
  message: ApiSupportMessage
  riderAvatar: string | null
  riderName: string
  supportAvatar: string | null
  supportName: string
}

function MessageAvatar({
  avatar,
  name,
}: {
  avatar: string | null
  name: string
}) {
  return (
    <Avatar className="size-10 shrink-0">
      {avatar ? <AvatarImage src={avatar} alt={name} /> : null}
      <AvatarFallback className="bg-muted text-xs font-semibold text-primary">
        {getUserInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}

export function ChatMessageBubble({
  message,
  riderAvatar,
  riderName,
  supportAvatar,
  supportName,
}: ChatMessageBubbleProps) {
  const isSupport = message.sender_type === "support"

  return (
    <div
      className={cn(
        "flex items-start gap-2",
        isSupport ? "justify-end" : "justify-start"
      )}
    >
      {!isSupport ? (
        <MessageAvatar avatar={riderAvatar} name={riderName} />
      ) : null}

      <div
        className={cn(
          "flex max-w-[min(100%,20rem)] flex-col gap-1",
          isSupport ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isSupport
              ? "bg-primary text-primary-foreground"
              : "border border-primary bg-secondary text-primary"
          )}
        >
          {message.message}
        </div>
        <span className="px-1 text-[11px] text-muted-foreground">
          {formatChatMessageTime(message.created_at)}
        </span>
      </div>

      {isSupport ? (
        <MessageAvatar avatar={supportAvatar} name={supportName} />
      ) : null}
    </div>
  )
}
