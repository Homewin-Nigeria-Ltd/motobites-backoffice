"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

import { offlineOrderKeys } from "../api/keys"
import { offlineOrderMutations } from "../api/mutations"

function invalidateSavedOrders(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: offlineOrderKeys.all })
}

export function useDeleteSavedOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    ...offlineOrderMutations.deleteSavedOrder,
    onSuccess: () => {
      invalidateSavedOrders(queryClient)
    },
  })
}

export function useClearAllSavedOrders() {
  const queryClient = useQueryClient()

  return useMutation({
    ...offlineOrderMutations.clearAllSavedOrders,
    onSuccess: () => {
      invalidateSavedOrders(queryClient)
    },
  })
}

export async function deleteSavedOrderWithToast(
  mutation: ReturnType<typeof useDeleteSavedOrder>,
  orderId: string | number,
) {
  try {
    await mutation.mutateAsync(orderId)
    toast.success("Saved order deleted.")
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "Failed to delete saved order."

    toast.error(message)
    throw error
  }
}

export async function clearAllSavedOrdersWithToast(
  mutation: ReturnType<typeof useClearAllSavedOrders>,
) {
  try {
    await mutation.mutateAsync()
    toast.success("All saved orders cleared.")
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "Failed to clear saved orders."

    toast.error(message)
    throw error
  }
}
