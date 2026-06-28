"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ApiCustomerChatListItem } from "../types"
import {
  getConversationPreview,
  getConversationTimestamp,
  getCustomerAvatar,
  getCustomerInitials,
} from "../utils/chat-helpers"

type ChatConversationItemProps = {
  conversation: ApiCustomerChatListItem
  isSelected: boolean
  onSelect: (conversationId: string) => void
}

export function ChatConversationItem({
  conversation,
  isSelected,
  onSelect,
}: ChatConversationItemProps) {
  const { customer, unread_count } = conversation
  const avatar = getCustomerAvatar(customer)
  const preview = getConversationPreview(conversation)
  const timestamp = getConversationTimestamp(conversation)

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
        isSelected ? "bg-secondary" : "hover:bg-muted/60"
      )}
    >
      <Avatar className="size-11 shrink-0">
        {avatar ? <AvatarImage src={avatar} alt={customer.name} /> : null}
        <AvatarFallback className="bg-muted text-sm font-semibold text-primary">
          {getCustomerInitials(customer)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {customer.name}
          </p>
          {timestamp ? (
            <span className="shrink-0 text-xs text-muted-foreground">
              {timestamp}
            </span>
          ) : null}
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-sm text-muted-foreground">
            {preview ?? "No messages yet"}
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
