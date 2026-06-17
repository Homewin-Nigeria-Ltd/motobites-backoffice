"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { accountSettingsKeys } from "../api/keys"
import { accountSettingsMutations } from "../api/mutations"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useUpdateAccountTwoFactor() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...accountSettingsMutations.updateTwoFactor,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: accountSettingsKeys.twoFactor() })
      toast.success(
        response.message ??
          (response.data?.enabled
            ? "Two-factor authentication enabled"
            : "Two-factor authentication disabled")
      )
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to update two-factor authentication. Please try again."
      toast.error(message)
    },
  })

  return {
    updateTwoFactor: (enabled: boolean) => mutation.mutateAsync({ enabled }),
    isPending: mutation.isPending,
  }
}
