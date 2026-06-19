import type { QueryClient } from "@tanstack/react-query"

import { riderChatKeys } from "../api/keys"
import type {
  ApiSupportMessage,
  SupportConversationsResponse,
  SupportMessagesResponse,
} from "../types"

let pendingMessageId = 0

export function createPendingMessage(
  riderId: number,
  message: string
): ApiSupportMessage {
  pendingMessageId += 1

  return {
    id: -pendingMessageId,
    rider_id: riderId,
    sender_type: "support",
    message,
    read_at: null,
    created_at: new Date().toISOString(),
  }
}

function defaultMeta(total: number): SupportMessagesResponse["meta"] {
  return {
    current_page: 1,
    from: total > 0 ? 1 : null,
    last_page: 1,
    per_page: 50,
    to: total > 0 ? total : null,
    total,
  }
}

export function updateConversationPreviewInCache(
  queryClient: QueryClient,
  message: ApiSupportMessage
) {
  queryClient.setQueriesData<SupportConversationsResponse>(
    { queryKey: [...riderChatKeys.all, "conversations"] },
    (old) => {
      if (!old) {
        return old
      }

      const index = old.data.findIndex(
        (conversation) => conversation.rider.id === message.rider_id
      )

      if (index === -1) {
        return old
      }

      const current = old.data[index]
      const updatedConversation = {
        ...current,
        latest_message: message,
      }

      const nextData = [...old.data]
      nextData.splice(index, 1)
      nextData.unshift(updatedConversation)

      return {
        ...old,
        data: nextData,
      }
    }
  )
}

export function appendMessageToCache(
  queryClient: QueryClient,
  riderId: number | string,
  message: ApiSupportMessage
) {
  queryClient.setQueryData<SupportMessagesResponse>(
    riderChatKeys.messages(riderId),
    (old) => {
      const existing = old?.data ?? []

      if (existing.some((item) => item.id === message.id)) {
        return old
      }

      const nextMessages = [...existing, message]

      return {
        data: nextMessages,
        meta: old?.meta ?? defaultMeta(nextMessages.length),
      }
    }
  )

  updateConversationPreviewInCache(queryClient, message)
}

export function replacePendingMessageInCache(
  queryClient: QueryClient,
  riderId: number | string,
  pendingId: number,
  serverMessage: ApiSupportMessage
) {
  queryClient.setQueryData<SupportMessagesResponse>(
    riderChatKeys.messages(riderId),
    (old) => {
      const withoutPending = (old?.data ?? []).filter(
        (message) => message.id !== pendingId
      )

      if (withoutPending.some((message) => message.id === serverMessage.id)) {
        return {
          data: withoutPending,
          meta: old?.meta ?? defaultMeta(withoutPending.length),
        }
      }

      const nextMessages = [...withoutPending, serverMessage]

      return {
        data: nextMessages,
        meta: old?.meta ?? defaultMeta(nextMessages.length),
      }
    }
  )

  updateConversationPreviewInCache(queryClient, serverMessage)
}

export function removeMessageFromCache(
  queryClient: QueryClient,
  riderId: number | string,
  messageId: number
) {
  queryClient.setQueryData<SupportMessagesResponse>(
    riderChatKeys.messages(riderId),
    (old) => {
      if (!old) {
        return old
      }

      const nextMessages = old.data.filter((message) => message.id !== messageId)

      if (nextMessages.length === old.data.length) {
        return old
      }

      return {
        data: nextMessages,
        meta: old.meta,
      }
    }
  )
}

export function parseRealtimeMessage(
  event: { message?: ApiSupportMessage } & Partial<ApiSupportMessage>
): ApiSupportMessage | null {
  const candidate = event.message ?? event

  if (
    typeof candidate.id !== "number" ||
    typeof candidate.message !== "string" ||
    !candidate.sender_type
  ) {
    return null
  }

  return candidate as ApiSupportMessage
}
