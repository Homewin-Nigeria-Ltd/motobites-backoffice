"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

import { offlineOrderKeys } from "../api/keys"
import { offlineOrderMutations } from "../api/mutations"
import type {
  OfflineOrderCartItem,
  OfflineOrderCheckoutDraft,
} from "../types"
import { buildSaveOfflineOrderPayload } from "../utils/build-offline-order-payload"

type SaveOfflineOrderInput = {
  items: OfflineOrderCartItem[]
  checkout: OfflineOrderCheckoutDraft
}

export function useSaveOfflineOrder() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...offlineOrderMutations.saveOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offlineOrderKeys.all })
    },
  })

  const saveOfflineOrder = async (input: SaveOfflineOrderInput) => {
    const payload = buildSaveOfflineOrderPayload(input.items, input.checkout)

    try {
      await mutation.mutateAsync(payload)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to save offline order. Please try again."

      toast.error(message)
      throw error
    }
  }

  return {
    saveOfflineOrder,
    isPending: mutation.isPending,
  }
}
