import type {
  ApiCustomerChatCustomer,
  ApiCustomerChatDetail,
  ApiCustomerChatListItem,
  ApiCustomerChatMessage,
} from "../types"
import { formatChatConversationTime } from "./format-chat-time"

export function getCustomerAvatar(customer: ApiCustomerChatCustomer) {
  return customer.profile?.avatar ?? null
}

export function getCustomerInitials(customer: ApiCustomerChatCustomer) {
  return customer.initials?.trim() || customer.name.slice(0, 1).toUpperCase()
}

export function getMessageBody(message: ApiCustomerChatMessage) {
  return message.body
}

export function isSupportMessage(message: ApiCustomerChatMessage) {
  return message.is_admin || message.sender_role === "admin"
}

export function isSystemMessage(message: ApiCustomerChatMessage) {
  return message.is_system || message.message_type === "system"
}

export function isChatClosed(
  chat: Pick<ApiCustomerChatListItem | ApiCustomerChatDetail, "status" | "is_closed">
) {
  return chat.is_closed === true || chat.status === "closed"
}

export function sortMessagesChronologically(messages: ApiCustomerChatMessage[]) {
  return [...messages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
}

export function getConversationPreview(
  conversation: Pick<ApiCustomerChatListItem, "preview">
) {
  return conversation.preview.trim() || null
}

export function getConversationTimestamp(
  conversation: Pick<
    ApiCustomerChatListItem,
    "last_message_at" | "last_message_at_iso"
  >
) {
  if (conversation.last_message_at) {
    return conversation.last_message_at
  }

  if (conversation.last_message_at_iso) {
    return formatChatConversationTime(conversation.last_message_at_iso)
  }

  return null
}
