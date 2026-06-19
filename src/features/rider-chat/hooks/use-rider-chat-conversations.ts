"use client"

import { useQuery } from "@tanstack/react-query"

import { riderChatQueries } from "../api/queries"
import type { SupportConversationsParams } from "../types"

export function useRiderChatConversations(
  params: SupportConversationsParams = {}
) {
  return useQuery(riderChatQueries.conversations(params))
}
