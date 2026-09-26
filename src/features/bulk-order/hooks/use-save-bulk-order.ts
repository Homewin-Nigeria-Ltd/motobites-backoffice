"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"
import type { OfflineOrderCheckoutDraft } from "@/features/offline-order/types"

import { bulkOrderKeys } from "../api/keys"
import { bulkOrderMutations } from "../api/mutations"
import type { BulkOrderCartItem, BulkOrderSource } from "../types"
import { buildSaveBulkOrderPayload } from "../utils/build-payload"
import {
  readActiveSavedOrderId,
  writeActiveSavedOrderId,
} from "./use-bulk-order-cart"

type SaveBulkOrderInput = {
  items: BulkOrderCartItem[]
  checkout: OfflineOrderCheckoutDraft
  source: BulkOrderSource
}

export function useSaveBulkOrder() {
  const queryClient = useQueryClient()

  const saveMutation = useMutation({
    ...bulkOrderMutations.saveOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bulkOrderKeys.all })
    },
  })

  const updateMutation = useMutation({
    ...bulkOrderMutations.updateSavedOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bulkOrderKeys.all })
    },
  })

  const saveBulkOrder = async (input: SaveBulkOrderInput) => {
    const payload = buildSaveBulkOrderPayload(
      input.items,
      input.checkout,
      input.source,
    )
    const activeId = readActiveSavedOrderId()

    try {
      const response = activeId
        ? await updateMutation.mutateAsync({ orderId: activeId, payload })
        : await saveMutation.mutateAsync(payload)

      const savedId = response.data?.id
      if (savedId != null) {
        writeActiveSavedOrderId(String(savedId))
      }

      return response.data
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to save bulk order. Please try again."

      toast.error(message)
      throw error
    }
  }

  return {
    saveBulkOrder,
    isPending: saveMutation.isPending || updateMutation.isPending,
  }
}
