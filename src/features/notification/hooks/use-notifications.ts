"use client"

import { useQuery } from "@tanstack/react-query"

import { notificationQueries } from "../api/queries"
import type { NotificationsListParams } from "../types"

export function useNotifications(params: NotificationsListParams) {
  return useQuery(notificationQueries.list(params))
}
