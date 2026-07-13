"use client"

import { useQuery } from "@tanstack/react-query"

import {
  NOTIFICATIONS_PER_PAGE,
  notificationQueries,
} from "../api/queries"

export function useUnreadNotificationCount() {
  return useQuery({
    ...notificationQueries.list({
      filter: "all",
      per_page: NOTIFICATIONS_PER_PAGE,
    }),
    select: (data) => data.meta.unread_count,
  })
}
