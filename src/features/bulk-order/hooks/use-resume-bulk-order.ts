"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"
import type { ApiSalesDashboardOrder } from "@/features/offline-order/types"

import { bulkOrderQueries } from "../api/queries"
import {
  mapBulkOrderItemsToCart,
  mapBulkOrderToCheckout,
  resolveBulkOrderSource,
} from "../utils/map-order"
import {
  restoreBulkOrderCart,
  restoreBulkOrderSource,
  writeActiveSavedOrderId,
} from "./use-bulk-order-cart"
import { restoreBulkOrderCheckout } from "./use-bulk-order-checkout"

function restoreSavedOrderToSession(order: ApiSalesDashboardOrder) {
  const items = mapBulkOrderItemsToCart(order)

  if (items.length === 0) {
    return false
  }

  restoreBulkOrderCart(items)
  restoreBulkOrderCheckout(mapBulkOrderToCheckout(order))
  restoreBulkOrderSource(resolveBulkOrderSource(order))
  writeActiveSavedOrderId(String(order.id))
  return true
}

export function useResumeBulkOrder() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isPending, setIsPending] = useState(false)

  const resumeOrderById = useCallback(
    async (orderId: string | number) => {
      setIsPending(true)

      try {
        const order = await queryClient.fetchQuery(
          bulkOrderQueries.savedOrder(orderId),
        )

        if (!restoreSavedOrderToSession(order)) {
          toast.error("This order has no items available to resume.")
          return false
        }

        router.push("/offline-order/bulk/payment")
        return true
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "Failed to load saved bulk order."

        toast.error(message)
        return false
      } finally {
        setIsPending(false)
      }
    },
    [queryClient, router],
  )

  const resumeOrder = useCallback(
    (order: ApiSalesDashboardOrder) => {
      if (!restoreSavedOrderToSession(order)) {
        return false
      }

      router.push("/offline-order/bulk/payment")
      return true
    },
    [router],
  )

  return {
    resumeOrder,
    resumeOrderById,
    isPending,
  }
}
