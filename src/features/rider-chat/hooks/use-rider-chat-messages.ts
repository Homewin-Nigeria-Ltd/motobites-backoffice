"use client"

import { useQuery } from "@tanstack/react-query"

import { riderChatQueries } from "../api/queries"
import type { SupportMessagesParams } from "../types"

export function useRiderChatMessages(
  riderId: string | number | null,
  params: SupportMessagesParams = {}
) {
  return useQuery({
    ...riderChatQueries.messages(riderId ?? "", params),
    enabled: Boolean(riderId),
  })
}
