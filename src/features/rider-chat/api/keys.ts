import type { SupportConversationsParams, SupportMessagesParams } from "../types"

export const riderChatKeys = {
  all: ["rider-chat"] as const,
  conversations: (params?: SupportConversationsParams) =>
    [...riderChatKeys.all, "conversations", params ?? {}] as const,
  messages: (riderId: string | number, params?: SupportMessagesParams) =>
    [...riderChatKeys.all, "messages", riderId, params ?? {}] as const,
}
