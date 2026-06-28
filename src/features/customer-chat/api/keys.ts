import type { CustomerChatListParams } from "../types"

export const customerChatKeys = {
  all: ["customer-chat"] as const,
  conversations: (params?: CustomerChatListParams) =>
    [...customerChatKeys.all, "conversations", params ?? {}] as const,
  detail: (chatId: string) =>
    [...customerChatKeys.all, "detail", chatId] as const,
}
