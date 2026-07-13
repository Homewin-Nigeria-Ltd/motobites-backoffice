"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { notificationMutations } from "../api/mutations"
import { notificationKeys } from "../api/keys"
import type { NotificationsApiResponse } from "../types"

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...notificationMutations.markAsRead,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all })

      const previousQueries = queryClient.getQueriesData<NotificationsApiResponse>({
        queryKey: notificationKeys.all,
      })

      queryClient.setQueriesData<NotificationsApiResponse>(
        { queryKey: notificationKeys.all },
        (current) => {
          if (!current) {
            return current
          }

          let wasUnread = false

          const data = current.data.map((notification) => {
            if (notification.id !== notificationId) {
              return notification
            }

            if (!notification.is_read) {
              wasUnread = true
            }

            return {
              ...notification,
              is_read: true,
              read_at: notification.read_at ?? new Date().toISOString(),
            }
          })

          return {
            ...current,
            data,
            meta: {
              ...current.meta,
              unread_count: wasUnread
                ? Math.max(0, current.meta.unread_count - 1)
                : current.meta.unread_count,
            },
          }
        },
      )

      return { previousQueries }
    },
    onError: (_error, _notificationId, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })

  return {
    markAsRead: mutation.mutate,
    isPending: mutation.isPending,
  }
}
