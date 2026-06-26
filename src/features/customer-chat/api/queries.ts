import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type {
  CustomerChatDetailResponse,
  CustomerChatListParams,
  CustomerChatListResponse,
} from "../types"
import { customerChatEndpoints } from "./endpoints"
import { customerChatKeys } from "./keys"

function fetchCustomerChats(params: CustomerChatListParams = {}) {
  const query: Record<string, string | number> = {
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
  }

  return api.get<CustomerChatListResponse>(customerChatEndpoints.chats, query)
}

function fetchCustomerChatDetail(chatId: string) {
  return api.get<CustomerChatDetailResponse>(customerChatEndpoints.chat(chatId))
}

export const customerChatQueries = {
  conversations: (params: CustomerChatListParams = {}) =>
    queryOptions({
      queryKey: customerChatKeys.conversations(params),
      queryFn: () => fetchCustomerChats(params),
    }),
  detail: (chatId: string) =>
    queryOptions({
      queryKey: customerChatKeys.detail(chatId),
      queryFn: () => fetchCustomerChatDetail(chatId),
      enabled: Boolean(chatId),
    }),
}
