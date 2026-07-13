import { api } from "@/lib/api/client"
import type {
  MarkAllNotificationsReadApiResponse,
  MarkNotificationReadApiResponse,
} from "../types"
import { notificationEndpoints } from "./endpoints"

export const notificationMutations = {
  markAsRead: {
    mutationFn: (notificationId: string) =>
      api.patch<MarkNotificationReadApiResponse, Record<string, never>>(
        notificationEndpoints.read(notificationId),
        {},
      ),
  },
  markAllAsRead: {
    mutationFn: () =>
      api.post<MarkAllNotificationsReadApiResponse, Record<string, never>>(
        notificationEndpoints.readAll,
        {},
      ),
  },
} as const
