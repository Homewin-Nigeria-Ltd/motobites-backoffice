"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

import { offlineOrderKeys } from "../api/keys"
import { offlineOrderMutations } from "../api/mutations"
import type {
  OfflineOrderCartItem,
  OfflineOrderCheckoutDraft,
  OfflineOrderReceipt,
} from "../types"
import { buildOfflineOrderPayload } from "../utils/build-offline-order-payload"
import { mapOfflineOrderReceipt } from "../utils/map-offline-order-receipt"

type PlaceOfflineOrderInput = {
  items: OfflineOrderCartItem[]
  checkout: OfflineOrderCheckoutDraft
  takenByName: string
}

export function usePlaceOfflineOrder() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...offlineOrderMutations.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offlineOrderKeys.all })
    },
  })

  const placeOfflineOrder = async (
    input: PlaceOfflineOrderInput,
  ): Promise<OfflineOrderReceipt> => {
    const payload = buildOfflineOrderPayload(input.items, input.checkout)

    try {
      const response = await mutation.mutateAsync(payload)

      return mapOfflineOrderReceipt({
        apiOrder: response.data,
        items: input.items,
        checkout: input.checkout,
        takenByName: input.takenByName,
      })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to place offline order. Please try again."

      toast.error(message)
      throw error
    }
  }

  return {
    placeOfflineOrder,
    isPending: mutation.isPending,
  }
}
