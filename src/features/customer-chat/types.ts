export const customerChatFilters = ["all", "unread", "closed"] as const

export type CustomerChatFilter = (typeof customerChatFilters)[number]

export type ApiCustomerChatMessageType = "text" | "system" | string

export type ApiCustomerChatSenderRole = "customer" | "admin" | string

export type ApiCustomerChatSender = {
  id: number
  name: string
}

export type ApiCustomerChatMessage = {
  id: string
  body: string
  message_type: ApiCustomerChatMessageType
  sender_role: ApiCustomerChatSenderRole
  is_admin: boolean
  is_system: boolean
  attachment_url: string | null
  sender: ApiCustomerChatSender
  created_at: string
}

export type CustomerChatMeta = {
  current_page: number
  from?: number | null
  last_page: number
  per_page: number
  to?: number | null
  total: number
}

export type CustomerChatListParams = {
  page?: number
  per_page?: number
}

export type ApiCustomerChatCustomer = {
  id: number
  name: string
  initials?: string
  is_online?: boolean
  profile?: {
    avatar: string | null
  }
}

export type ApiCustomerChatOpenedBy = {
  id: number
  name: string
  message: string
}

export type ApiCustomerChatListItem = {
  id: string
  status: "open" | "closed"
  is_closed: boolean
  customer: ApiCustomerChatCustomer
  preview: string
  unread_count: number
  last_message_at: string
  last_message_at_iso: string
}

export type ApiCustomerChatDetail = {
  id: string
  status: "open" | "closed"
  is_closed: boolean
  customer: ApiCustomerChatCustomer
  opened_by?: ApiCustomerChatOpenedBy | null
  messages: ApiCustomerChatMessage[]
  rating?: number | null
  closed_at?: string | null
}

/** @deprecated Use ApiCustomerChatListItem */
export type ApiCustomerChat = ApiCustomerChatListItem

export type CustomerChatListResponse = {
  success?: boolean
  data: ApiCustomerChatListItem[]
  meta?: CustomerChatMeta
}

export type CustomerChatDetailResponse = {
  success?: boolean
  data: ApiCustomerChatDetail
  message?: string
}

export type SendCustomerChatMessageInput = {
  chatId: string
  body: string
}

export type SendCustomerChatMessageResponse = {
  success?: boolean
  data: ApiCustomerChatMessage
  message?: string
}

export type CloseCustomerChatInput = {
  chatId: string
}

export type CloseCustomerChatResponse = {
  success?: boolean
  data?: ApiCustomerChatDetail
  message?: string
}
