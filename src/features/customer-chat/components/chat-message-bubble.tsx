"use client"

import { cn } from "@/lib/utils"
import { getUserInitials } from "@/utils/get-initials"
import type { ApiCustomerChatMessage } from "../types"
import {
  getMessageBody,
  isSupportMessage,
  isSystemMessage,
} from "../utils/chat-helpers"
import { formatChatMessageTime } from "../utils/format-chat-time"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

type ChatMessageBubbleProps = {
  message: ApiCustomerChatMessage
  customerAvatar: string | null
  customerName: string
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
  customerAvatar,
  customerName,
  supportAvatar,
  supportName,
}: ChatMessageBubbleProps) {
  if (isSystemMessage(message)) {
    return (
      <div className="flex justify-center py-1">
        <span className="rounded-full bg-muted px-3 py-1 text-center text-xs text-muted-foreground">
          {getMessageBody(message)}
        </span>
      </div>
    )
  }

  const isSupport = isSupportMessage(message)
  const senderName = message.sender?.name ?? (isSupport ? supportName : customerName)
  const senderAvatar = isSupport ? supportAvatar : customerAvatar

  return (
    <div
      className={cn(
        "flex items-start gap-2",
        isSupport ? "justify-end" : "justify-start"
      )}
    >
      {!isSupport ? (
        <MessageAvatar avatar={senderAvatar} name={senderName} />
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
          {getMessageBody(message)}
        </div>
        <span className="px-1 text-[11px] text-muted-foreground">
          {formatChatMessageTime(message.created_at)}
        </span>
      </div>

      {isSupport ? (
        <MessageAvatar avatar={senderAvatar} name={senderName} />
      ) : null}
    </div>
  )
}
