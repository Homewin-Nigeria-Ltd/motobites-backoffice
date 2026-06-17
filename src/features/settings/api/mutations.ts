import { api } from "@/lib/api/client"
import type { UpdateNotificationPreferencesApiResponse } from "../types"
import type { NotificationPreferencesFormValues } from "../schemas/notification-preferences.schema"
import { settingsEndpoints } from "./endpoints"

export const settingsMutations = {
  updateNotifications: {
    mutationFn: (input: NotificationPreferencesFormValues) =>
      api.patch<
        UpdateNotificationPreferencesApiResponse,
        NotificationPreferencesFormValues
      >(settingsEndpoints.notifications, input),
  },
} as const
