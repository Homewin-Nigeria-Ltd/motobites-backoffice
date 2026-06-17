"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { accountSettingsKeys } from "../api/keys"
import { accountSettingsMutations } from "../api/mutations"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useRevokeAccountDevice() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...accountSettingsMutations.revokeDevice,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: accountSettingsKeys.devices() })
      toast.success(response.message ?? "Device signed out successfully")
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to sign out device. Please try again."
      toast.error(message)
    },
  })

  return {
    revokeDevice: (tokenId: number) => mutation.mutateAsync(tokenId),
    isPending: mutation.isPending,
    pendingDeviceId: mutation.isPending ? mutation.variables : null,
  }
}
