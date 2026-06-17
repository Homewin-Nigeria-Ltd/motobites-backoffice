"use client"

import { useMutation } from "@tanstack/react-query"

import { accountSettingsMutations } from "../api/mutations"
import type { UpdateAccountPersonalInfoInput } from "../types"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

function buildPayload(input: UpdateAccountPersonalInfoInput) {
  const payload: UpdateAccountPersonalInfoInput = {
    first_name: input.first_name,
    last_name: input.last_name,
    language: input.language,
  }

  if (input.profile_photo_path?.trim()) {
    payload.profile_photo_path = input.profile_photo_path.trim()
  }

  if (input.profile_photo?.trim()) {
    payload.profile_photo = input.profile_photo.trim()
  }

  return payload
}

export function useUpdateAccountPersonalInfo() {
  const mutation = useMutation({
    ...accountSettingsMutations.updatePersonal,
    mutationFn: (input: UpdateAccountPersonalInfoInput) =>
      accountSettingsMutations.updatePersonal.mutationFn(buildPayload(input)),
    onSuccess: (response) => {
      toast.success(response.message ?? "Personal information updated")
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to update personal information. Please try again."
      toast.error(message)
    },
  })

  return {
    updatePersonalInfo: (input: UpdateAccountPersonalInfoInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}
