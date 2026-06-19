"use client"

import { ChatConversationItem } from "./chat-conversation-item"
import type { ApiSupportConversation } from "../types"

type ChatConversationListProps = {
  conversations: ApiSupportConversation[]
  selectedConversationId: string
  onSelect: (conversationId: string) => void
}

export function ChatConversationList({
  conversations,
  selectedConversationId,
  onSelect,
}: ChatConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-8 text-center text-sm text-muted-foreground">
        No conversations found.
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
      {conversations.map((conversation) => (
        <ChatConversationItem
          key={conversation.rider.id}
          conversation={conversation}
          isSelected={String(conversation.rider.id) === selectedConversationId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
