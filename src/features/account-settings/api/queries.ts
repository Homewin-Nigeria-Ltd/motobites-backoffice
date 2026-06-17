import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type {
  AccountDevicesApiResponse,
  AccountTwoFactorApiResponse,
} from "../types"
import { accountSettingsEndpoints } from "./endpoints"
import { accountSettingsKeys } from "./keys"

export const accountSettingsQueries = {
  devices: () =>
    queryOptions({
      queryKey: accountSettingsKeys.devices(),
      queryFn: async () => {
        const response = await api.get<AccountDevicesApiResponse>(
          accountSettingsEndpoints.devices
        )
        return response.data
      },
      staleTime: 30_000,
    }),

  twoFactor: () =>
    queryOptions({
      queryKey: accountSettingsKeys.twoFactor(),
      queryFn: async () => {
        const response = await api.get<AccountTwoFactorApiResponse>(
          accountSettingsEndpoints.twoFactor
        )
        return response.data
      },
      staleTime: 30_000,
    }),
}
