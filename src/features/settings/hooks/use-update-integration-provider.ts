"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { settingsMutations } from "../api/mutations"
import { settingsKeys } from "../api/keys"
import type { UpdateIntegrationProviderPayload } from "../utils/build-integration-provider-form-data"
import { buildIntegrationProviderFormData } from "../utils/build-integration-provider-form-data"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useUpdateIntegrationProvider() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...settingsMutations.updateIntegrationProvider,
    onSuccess: (response, variables) => {
      void queryClient.invalidateQueries({
        queryKey: settingsKeys.integrationProvider(variables.provider),
      })
      void queryClient.invalidateQueries({
        queryKey: [...settingsKeys.all, "integrations"],
      })
      toast.success(response.message ?? "Integration settings saved")
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to save integration settings. Please try again."
      toast.error(message)
    },
  })

  return {
    updateIntegrationProvider: (
      provider: string,
      payload: UpdateIntegrationProviderPayload
    ) =>
      mutation.mutateAsync({
        provider,
        formData: buildIntegrationProviderFormData(payload),
      }),
    isPending: mutation.isPending,
  }
}
