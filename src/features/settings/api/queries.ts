import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
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
}
