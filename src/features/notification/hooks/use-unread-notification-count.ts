"use client"

import { useQuery } from "@tanstack/react-query"

import { notificationQueries } from "../api/queries"

export function useUnreadNotificationCount() {
  return useQuery({
    ...notificationQueries.list({
      filter: "all",
      page: 1,
      per_page: 1,
    }),
    select: (data) => data.meta.unread_count,
  })
}
