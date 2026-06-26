"use client"

import { Fragment, useEffect, useRef } from "react"

import { useSession } from "@/features/auth"
import { ChatMessageBubble } from "./chat-message-bubble"
import type { ApiCustomerChatMessage } from "../types"
import {
  formatChatDateDivider,
  isSameChatDay,
} from "../utils/format-chat-time"

type ChatMessageListProps = {
  messages: ApiCustomerChatMessage[]
  customerAvatar: string | null
  customerName: string
}

export function ChatMessageList({
  messages,
  customerAvatar,
  customerName,
}: ChatMessageListProps) {
  const { data: session } = useSession()
  const supportUser = session?.user
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastMessageId = messages.at(-1)?.id

  useEffect(() => {
    const container = scrollRef.current

    if (!container) {
      return
    }

    container.scrollTop = container.scrollHeight
  }, [lastMessageId, messages.length])

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto px-4 py-6 md:px-6"
    >
      <div className="flex flex-col gap-4">
        {messages.map((message, index) => {
          const previousMessage = index > 0 ? messages[index - 1] : null
          const showDateDivider =
            !previousMessage ||
            !isSameChatDay(previousMessage.created_at, message.created_at)

          return (
            <Fragment key={message.id}>
              {showDateDivider ? (
                <div className="flex justify-center py-2">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {formatChatDateDivider(message.created_at)}
                  </span>
                </div>
              ) : null}
              <ChatMessageBubble
                message={message}
                customerAvatar={customerAvatar}
                customerName={customerName}
                supportAvatar={supportUser?.profile_photo_url ?? null}
                supportName={supportUser?.name ?? "Support"}
              />
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
