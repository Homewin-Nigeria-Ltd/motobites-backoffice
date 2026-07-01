import type { QueryClient } from "@tanstack/react-query"

import { customerChatKeys } from "../api/keys"
import type {
  ApiCustomerChatMessage,
  ApiCustomerChatSender,
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
  const detailKey = customerChatKeys.detail(chatId)
  let updated = false

  queryClient.setQueryData<CustomerChatDetailResponse>(detailKey, (old) => {
    const existing = old?.data?.messages ?? []

    if (existing.some((item) => item.id === message.id)) {
      updated = Boolean(old?.data)
      return old
    }

    const nextMessages = [...existing, message]

    if (!old?.data) {
      return old
    }

    updated = true

    return {
      ...old,
      data: {
        ...old.data,
        messages: nextMessages,
      },
    }
  })

  if (!updated) {
    void queryClient.invalidateQueries({
      queryKey: detailKey,
      refetchType: "active",
    })
  }

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

type BroadcastMessagePayload = {
  id?: string | number
  body?: string
  message?: string | ApiCustomerChatMessage
  message_type?: string
  type?: string
  sender_role?: string
  file_url?: string | null
  attachment_url?: string | null
  is_admin?: boolean
  is_system?: boolean
  sender?: ApiCustomerChatSender
  created_at?: string
}

function resolveBroadcastCandidate(
  event: BroadcastMessagePayload & {
    message?: ApiCustomerChatMessage | string
    data?: BroadcastMessagePayload
  }
): BroadcastMessagePayload | null {
  if (event.data && typeof event.data === "object" && "id" in event.data) {
    return event.data
  }

  if (event.message && typeof event.message === "object") {
    return event.message
  }

  if (event.id !== undefined) {
    return event
  }

  return null
}

export function parseRealtimeMessage(
  event: BroadcastMessagePayload & {
    message?: ApiCustomerChatMessage | string
    data?: BroadcastMessagePayload
  }
): ApiCustomerChatMessage | null {
  const candidate = resolveBroadcastCandidate(event)

  if (!candidate) {
    return null
  }

  const id =
    typeof candidate.id === "string"
      ? candidate.id
      : typeof candidate.id === "number"
        ? String(candidate.id)
        : null

  const body =
    typeof candidate.body === "string"
      ? candidate.body
      : typeof candidate.message === "string"
        ? candidate.message
        : null

  const senderRole = candidate.sender_role

  if (!id || !body || !senderRole) {
    return null
  }

  const messageType = candidate.message_type ?? candidate.type ?? "text"
  const isSystem = candidate.is_system ?? messageType === "system"
  const isAdmin = candidate.is_admin ?? senderRole === "admin"

  return {
    id,
    body,
    message_type: messageType,
    sender_role: senderRole,
    is_admin: isAdmin,
    is_system: isSystem,
    attachment_url: candidate.attachment_url ?? candidate.file_url ?? null,
    sender: candidate.sender ?? {
      id: 0,
      name: isAdmin ? "Support" : "Customer",
    },
    created_at: candidate.created_at ?? new Date().toISOString(),
  }
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
