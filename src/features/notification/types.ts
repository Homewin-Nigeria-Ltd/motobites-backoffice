export type NotificationFilter = "all" | "unread"

export type ApiNotification = {
  id: string
  category: string
  category_label: string
  message: string
  metadata?: Record<string, unknown>
  is_read: boolean
  read_at: string | null
  action: {
    label: string
    target: string
  }
  created_at: string
  formatted_at: string
}

export type NotificationsMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
  unread_count: number
}

export type NotificationsListParams = {
  filter: NotificationFilter
  page?: number
  per_page?: number
}

export type NotificationsApiResponse = {
  success: boolean
  data: ApiNotification[]
  meta: NotificationsMeta
  message?: string
}
