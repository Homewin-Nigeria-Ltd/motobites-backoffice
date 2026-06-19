import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type {
  IntegrationCategory,
  IntegrationProviderApiResponse,
  IntegrationsApiResponse,
} from "../integration.types"
import type { NotificationPreferencesApiResponse } from "../types"
import { settingsEndpoints } from "./endpoints"
import { settingsKeys } from "./keys"

export const settingsQueries = {
  notifications: () =>
    queryOptions({
      queryKey: settingsKeys.notifications(),
      queryFn: async () => {
        const response = await api.get<NotificationPreferencesApiResponse>(
          settingsEndpoints.notifications
        )
        return response.data
      },
      staleTime: 60_000,
    }),
  integrations: (category: IntegrationCategory) =>
    queryOptions({
      queryKey: settingsKeys.integrations(category),
      queryFn: async () => {
        const response = await api.get<IntegrationsApiResponse>(
          settingsEndpoints.integrations(category)
        )
        return response.data
      },
      staleTime: 60_000,
    }),
  integrationProvider: (provider: string) =>
    queryOptions({
      queryKey: settingsKeys.integrationProvider(provider),
      queryFn: async () => {
        const response = await api.get<IntegrationProviderApiResponse>(
          settingsEndpoints.integrationProvider(provider)
        )
        return response.data
      },
      staleTime: 60_000,
    }),
}
