"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ridersKeys } from "../api/keys"
import { ridersMutations } from "../api/mutations"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useUpdateRiderStatus() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...ridersMutations.updateStatus,
    onSuccess: (response, variables) => {
      void queryClient.invalidateQueries({ queryKey: ridersKeys.all })
      void queryClient.invalidateQueries({
        queryKey: ridersKeys.detail(variables.riderId),
      })

      toast.success(
        response.message ??
          (variables.onboarding_status === "approved"
            ? "Rider approved successfully"
            : "Rider rejected successfully")
      )
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to update rider status. Please try again."
      toast.error(message)
    },
  })

  return {
    approveRider: (riderId: string | number) =>
      mutation.mutateAsync({
        riderId,
        onboarding_status: "approved",
        user_status: "active",
        is_online: false,
      }),
    rejectRider: (riderId: string | number, review_notes: string) =>
      mutation.mutateAsync({
        riderId,
        onboarding_status: "rejected",
        user_status: "inactive",
        is_online: false,
        review_notes,
      }),
    isPending: mutation.isPending,
  }
}
