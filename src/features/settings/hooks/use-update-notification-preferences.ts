"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { settingsMutations } from "../api/mutations"
import { settingsKeys } from "../api/keys"
import type { NotificationPreferencesFormValues } from "../schemas/notification-preferences.schema"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...settingsMutations.updateNotifications,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.notifications() })
      toast.success(
        response.message ?? "Notification preferences updated"
      )
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to update notification preferences. Please try again."
      toast.error(message)
    },
  })

  return {
    updatePreferences: (values: NotificationPreferencesFormValues) =>
      mutation.mutateAsync(values),
    isPending: mutation.isPending,
  }
}
