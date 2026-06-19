import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type {
  SupportConversationsParams,
  SupportConversationsResponse,
  SupportMessagesParams,
  SupportMessagesResponse,
} from "../types"
import { riderChatEndpoints } from "./endpoints"
import { riderChatKeys } from "./keys"

function fetchSupportConversations(params: SupportConversationsParams = {}) {
  const query: Record<string, string | number> = {
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
  }

  return api.get<SupportConversationsResponse>(
    riderChatEndpoints.conversations,
    query
  )
}

function fetchSupportMessages(
  riderId: string | number,
  params: SupportMessagesParams = {}
) {
  const query: Record<string, string | number> = {
    page: params.page ?? 1,
    per_page: params.per_page ?? 50,
  }

  return api.get<SupportMessagesResponse>(
    riderChatEndpoints.messages(riderId),
    query
  )
}

export const riderChatQueries = {
  conversations: (params: SupportConversationsParams = {}) =>
    queryOptions({
      queryKey: riderChatKeys.conversations(params),
      queryFn: () => fetchSupportConversations(params),
    }),
  messages: (riderId: string | number, params: SupportMessagesParams = {}) =>
    queryOptions({
      queryKey: riderChatKeys.messages(riderId, params),
      queryFn: () => fetchSupportMessages(riderId, params),
      enabled: Boolean(riderId),
    }),
}
