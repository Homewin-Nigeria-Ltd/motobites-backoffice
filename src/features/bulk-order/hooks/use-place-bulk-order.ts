"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"
import type {
  OfflineOrderCheckoutDraft,
  OfflineOrderReceipt,
} from "@/features/offline-order/types"
import { mapOfflineOrderReceipt } from "@/features/offline-order/utils/map-offline-order-receipt"

import { bulkOrderKeys } from "../api/keys"
import { bulkOrderMutations } from "../api/mutations"
import type { BulkOrderCartItem, BulkOrderSource } from "../types"
import { buildBulkOrderPayload } from "../utils/build-payload"
import { toOfflineOrderCartItems } from "../utils/map-order"

type PlaceBulkOrderInput = {
  items: BulkOrderCartItem[]
  checkout: OfflineOrderCheckoutDraft
  source: BulkOrderSource
  takenByName: string
}

export function usePlaceBulkOrder() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...bulkOrderMutations.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bulkOrderKeys.all })
    },
  })

  const placeBulkOrder = async (
    input: PlaceBulkOrderInput,
  ): Promise<OfflineOrderReceipt> => {
    const payload = buildBulkOrderPayload(
      input.items,
      input.checkout,
      input.source,
    )

    try {
      const response = await mutation.mutateAsync(payload)

      return mapOfflineOrderReceipt({
        apiOrder: response.data,
        items: toOfflineOrderCartItems(input.items),
        checkout: input.checkout,
        takenByName: input.takenByName,
      })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to place bulk order. Please try again."

      toast.error(message)
      throw error
    }
  }

  return {
    placeBulkOrder,
    isPending: mutation.isPending,
  }
}
