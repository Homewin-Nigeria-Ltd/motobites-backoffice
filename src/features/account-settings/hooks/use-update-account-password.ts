"use client"

import { useMutation } from "@tanstack/react-query"

import { accountSettingsMutations } from "../api/mutations"
import type { UpdateAccountPasswordInput } from "../types"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useUpdateAccountPassword() {
  const mutation = useMutation({
    ...accountSettingsMutations.updatePassword,
    onSuccess: (response) => {
      toast.success(response.message ?? "Password updated successfully")
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to update password. Please try again."
      toast.error(message)
    },
  })

  return {
    updatePassword: (input: UpdateAccountPasswordInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}
