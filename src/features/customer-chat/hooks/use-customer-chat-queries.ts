"use client"

import { useQuery } from "@tanstack/react-query"

import { customerChatQueries } from "../api/queries"
import type { CustomerChatListParams } from "../types"

export function useCustomerChatConversations(
  params: CustomerChatListParams = {}
) {
  return useQuery(customerChatQueries.conversations(params))
}

export function useCustomerChatDetail(chatId: string | null) {
  return useQuery({
    ...customerChatQueries.detail(chatId ?? ""),
    enabled: Boolean(chatId),
  })
}
