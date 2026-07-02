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

function fetchSupportConversations() {
  return api.get<SupportConversationsResponse>(
    riderChatEndpoints.conversations
  )
}

function fetchSupportMessages(riderId: string | number) {
  return api.get<SupportMessagesResponse>(riderChatEndpoints.messages(riderId))
}

export const riderChatQueries = {
  conversations: (params: SupportConversationsParams = {}) =>
    queryOptions({
      queryKey: riderChatKeys.conversations(params),
      queryFn: () => fetchSupportConversations(),
    }),
  messages: (riderId: string | number, params: SupportMessagesParams = {}) =>
    queryOptions({
      queryKey: riderChatKeys.messages(riderId, params),
      queryFn: () => fetchSupportMessages(riderId),
      enabled: Boolean(riderId),
    }),
}
