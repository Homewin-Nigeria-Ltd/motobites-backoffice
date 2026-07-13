"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { notificationMutations } from "../api/mutations"
import { notificationKeys } from "../api/keys"
import type { NotificationsApiResponse } from "../types"

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...notificationMutations.markAllAsRead,
    onMutate: async () => {
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

          return {
            ...current,
            data: current.data.map((notification) => ({
              ...notification,
              is_read: true,
              read_at: notification.read_at ?? new Date().toISOString(),
            })),
            meta: {
              ...current.meta,
              unread_count: 0,
            },
          }
        },
      )

      return { previousQueries }
    },
    onError: (_error, _variables, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })

  return {
    markAllAsRead: mutation.mutate,
    isPending: mutation.isPending,
  }
}
