"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ApiSupportConversation } from "../types"
import { formatChatConversationTime } from "../utils/format-chat-time"
import { getUserInitials } from "@/utils/get-initials"

type ChatConversationItemProps = {
  conversation: ApiSupportConversation
  isSelected: boolean
  onSelect: (conversationId: string) => void
}

export function ChatConversationItem({
  conversation,
  isSelected,
  onSelect,
}: ChatConversationItemProps) {
  const { rider, latest_message, unread_count } = conversation

  return (
    <button
      type="button"
      onClick={() => onSelect(String(rider.id))}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
        isSelected ? "bg-secondary" : "hover:bg-muted/60"
      )}
    >
      <Avatar className="size-11 shrink-0">
        {rider.profile.avatar ? (
          <AvatarImage src={rider.profile.avatar} alt={rider.name} />
        ) : null}
        <AvatarFallback className="bg-muted text-sm font-semibold text-primary">
          {getUserInitials(rider.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {rider.name}
          </p>
          {latest_message ? (
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatChatConversationTime(latest_message.created_at)}
            </span>
          ) : null}
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-sm text-muted-foreground">
            {latest_message?.message ?? "No messages yet"}
          </p>
          {unread_count > 0 ? (
            <Badge className="size-5 shrink-0 rounded-full bg-primary px-0 text-xs font-semibold text-primary-foreground">
              {unread_count}
            </Badge>
          ) : null}
        </div>
      </div>
    </button>
  )
}
