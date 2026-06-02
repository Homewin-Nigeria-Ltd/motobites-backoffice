import { queryOptions } from "@tanstack/react-query"

import { ApiError, api } from "@/lib/api/client"
import type { MeApiResponse, Session } from "../types"
import { authEndpoints } from "./endpoints"
import { authKeys } from "./keys"

export const authQueries = {
  session: () =>
    queryOptions({
      queryKey: authKeys.session(),
      queryFn: async (): Promise<Session | null> => {
        try {
          const response = await api.get<MeApiResponse>(authEndpoints.me)
          return { user: response.data.user }
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) {
            return null
          }

          throw error
        }
      },
      retry: false,
    }),
}
