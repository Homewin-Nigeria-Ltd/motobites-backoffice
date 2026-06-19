import { api } from "@/lib/api/client"
import type { IntegrationProviderApiResponse } from "../integration.types"
import type { UpdateNotificationPreferencesApiResponse } from "../types"
import type { NotificationPreferencesFormValues } from "../schemas/notification-preferences.schema"
import { settingsEndpoints } from "./endpoints"

export type UpdateIntegrationProviderInput = {
  provider: string
  formData: FormData
}

export const settingsMutations = {
  updateNotifications: {
    mutationFn: (input: NotificationPreferencesFormValues) =>
      api.patch<
        UpdateNotificationPreferencesApiResponse,
        NotificationPreferencesFormValues
      >(settingsEndpoints.notifications, input),
  },
  updateIntegrationProvider: {
    mutationFn: ({ provider, formData }: UpdateIntegrationProviderInput) =>
      api.put<IntegrationProviderApiResponse, FormData>(
        settingsEndpoints.integrationProvider(provider),
        formData
      ),
  },
} as const
