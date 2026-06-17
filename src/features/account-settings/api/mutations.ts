import { api } from "@/lib/api/client"
import type {
  RevokeAccountDeviceApiResponse,
  UpdateAccountPasswordApiResponse,
  UpdateAccountPasswordInput,
  UpdateAccountPersonalInfoApiResponse,
  UpdateAccountPersonalInfoInput,
  UpdateAccountTwoFactorApiResponse,
  UpdateAccountTwoFactorInput,
} from "../types"
import { accountSettingsEndpoints } from "./endpoints"

export const accountSettingsMutations = {
  updatePassword: {
    mutationFn: (input: UpdateAccountPasswordInput) =>
      api.patch<UpdateAccountPasswordApiResponse>(
        accountSettingsEndpoints.updatePassword,
        input
      ),
  },
  updatePersonal: {
    mutationFn: (input: UpdateAccountPersonalInfoInput) =>
      api.patch<UpdateAccountPersonalInfoApiResponse>(
        accountSettingsEndpoints.updatePersonal,
        input
      ),
  },
  revokeDevice: {
    mutationFn: (tokenId: number) =>
      api.delete<RevokeAccountDeviceApiResponse>(
        accountSettingsEndpoints.device(tokenId)
      ),
  },
  updateTwoFactor: {
    mutationFn: (input: UpdateAccountTwoFactorInput) =>
      api.patch<UpdateAccountTwoFactorApiResponse, UpdateAccountTwoFactorInput>(
        accountSettingsEndpoints.twoFactor,
        input
      ),
  },
} as const
