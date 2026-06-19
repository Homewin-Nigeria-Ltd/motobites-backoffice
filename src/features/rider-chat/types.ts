export const riderChatFilters = ["all", "unread", "closed"] as const

export type RiderChatFilter = (typeof riderChatFilters)[number]

export type ApiSupportMessageSender = "rider" | "support"

export type ApiSupportMessage = {
  id: number
  rider_id: number
  sender_type: ApiSupportMessageSender
  message: string
  read_at: string | null
  created_at: string
}

export type SupportMessagesMeta = {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
}

export type SupportMessagesParams = {
  page?: number
  per_page?: number
}

export type SupportMessagesResponse = {
  data: ApiSupportMessage[]
  meta: SupportMessagesMeta
}

export type SendSupportMessageInput = {
  riderId: string | number
  message: string
}

export type SendSupportMessageResponse = {
  data: ApiSupportMessage
  message?: string
}

export type ApiSupportConversationRider = {
  id: number
  name: string
  first_name: string
  last_name: string | null
  profile: {
    avatar: string | null
  }
}

export type ApiSupportConversation = {
  rider: ApiSupportConversationRider
  latest_message: ApiSupportMessage | null
  unread_count: number
}

export type SupportConversationsParams = {
  page?: number
  per_page?: number
}

export type SupportConversationsResponse = {
  data: ApiSupportConversation[]
  meta: SupportMessagesMeta
}
