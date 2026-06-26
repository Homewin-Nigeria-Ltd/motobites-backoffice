import type { QueryClient } from "@tanstack/react-query"

import { customerChatKeys } from "../api/keys"
import type {
  ApiCustomerChatMessage,
  CustomerChatDetailResponse,
  CustomerChatListResponse,
} from "../types"
import { formatChatConversationTime } from "./format-chat-time"
import { getMessageBody } from "./chat-helpers"

let pendingMessageId = 0

export function createPendingMessage(body: string): ApiCustomerChatMessage {
  pendingMessageId += 1

  return {
    id: `pending-${pendingMessageId}`,
    body,
    message_type: "text",
    sender_role: "admin",
    is_admin: true,
    is_system: false,
    attachment_url: null,
    sender: {
      id: 0,
      name: "You",
    },
    created_at: new Date().toISOString(),
  }
}

export function updateConversationPreviewInCache(
  queryClient: QueryClient,
  chatId: string,
  message: ApiCustomerChatMessage
) {
  queryClient.setQueriesData<CustomerChatListResponse>(
    { queryKey: [...customerChatKeys.all, "conversations"] },
    (old) => {
      if (!old) {
        return old
      }

      const index = old.data.findIndex((conversation) => conversation.id === chatId)

      if (index === -1) {
        return old
      }

      const current = old.data[index]
      const updatedConversation = {
        ...current,
        preview: getMessageBody(message),
        last_message_at: formatChatConversationTime(message.created_at),
        last_message_at_iso: message.created_at,
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
  chatId: string,
  message: ApiCustomerChatMessage
) {
  queryClient.setQueryData<CustomerChatDetailResponse>(
    customerChatKeys.detail(chatId),
    (old) => {
      if (!old?.data) {
        return old
      }

      const existing = old.data.messages ?? []

      if (existing.some((item) => item.id === message.id)) {
        return old
      }

      const nextMessages = [...existing, message]

      return {
        ...old,
        data: {
          ...old.data,
          messages: nextMessages,
        },
      }
    }
  )

  updateConversationPreviewInCache(queryClient, chatId, message)
}

export function replacePendingMessageInCache(
  queryClient: QueryClient,
  chatId: string,
  pendingId: string,
  serverMessage: ApiCustomerChatMessage
) {
  queryClient.setQueryData<CustomerChatDetailResponse>(
    customerChatKeys.detail(chatId),
    (old) => {
      if (!old?.data) {
        return old
      }

      const withoutPending = (old.data.messages ?? []).filter(
        (item) => item.id !== pendingId
      )

      if (withoutPending.some((item) => item.id === serverMessage.id)) {
        return {
          ...old,
          data: {
            ...old.data,
            messages: withoutPending,
          },
        }
      }

      const nextMessages = [...withoutPending, serverMessage]

      return {
        ...old,
        data: {
          ...old.data,
          messages: nextMessages,
        },
      }
    }
  )

  updateConversationPreviewInCache(queryClient, chatId, serverMessage)
}

export function removeMessageFromCache(
  queryClient: QueryClient,
  chatId: string,
  messageId: string
) {
  queryClient.setQueryData<CustomerChatDetailResponse>(
    customerChatKeys.detail(chatId),
    (old) => {
      if (!old?.data) {
        return old
      }

      const nextMessages = (old.data.messages ?? []).filter(
        (message) => message.id !== messageId
      )

      if (nextMessages.length === (old.data.messages ?? []).length) {
        return old
      }

      return {
        ...old,
        data: {
          ...old.data,
          messages: nextMessages,
        },
      }
    }
  )
}

export function parseRealtimeMessage(
  event: { message?: ApiCustomerChatMessage } & Partial<ApiCustomerChatMessage>
): ApiCustomerChatMessage | null {
  const candidate = event.message ?? event

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.body !== "string" ||
    !candidate.sender_role
  ) {
    return null
  }

  return candidate as ApiCustomerChatMessage
}

export function markChatClosedInCache(
  queryClient: QueryClient,
  chatId: string
) {
  queryClient.setQueryData<CustomerChatDetailResponse>(
    customerChatKeys.detail(chatId),
    (old) => {
      if (!old?.data) {
        return old
      }

      return {
        ...old,
        data: {
          ...old.data,
          status: "closed",
          is_closed: true,
        },
      }
    }
  )

  queryClient.setQueriesData<CustomerChatListResponse>(
    { queryKey: [...customerChatKeys.all, "conversations"] },
    (old) => {
      if (!old) {
        return old
      }

      return {
        ...old,
        data: old.data.map((conversation) =>
          conversation.id === chatId
            ? {
                ...conversation,
                status: "closed" as const,
                is_closed: true,
              }
            : conversation
        ),
      }
    }
  )
}
