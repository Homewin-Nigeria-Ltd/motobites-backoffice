"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

import { offlineOrderQueries } from "../api/queries"
import type { ApiSalesDashboardOrder } from "../types"
import {
  mapSalesDashboardOrderItemsToCart,
  mapSalesDashboardOrderToCheckout,
} from "../utils/sales-dashboard-order"
import {
  restoreCartItems,
  restoreCheckout,
} from "./use-offline-order-storage"

function restoreSavedOrderToSession(order: ApiSalesDashboardOrder) {
  const items = mapSalesDashboardOrderItemsToCart(order)

  if (items.length === 0) {
    return false
  }

  restoreCartItems(items)
  restoreCheckout(mapSalesDashboardOrderToCheckout(order))
  return true
}

export function useResumeSalesDashboardOrder() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isPending, setIsPending] = useState(false)

  const resumeOrderById = useCallback(
    async (orderId: string | number) => {
      setIsPending(true)

      try {
        const order = await queryClient.fetchQuery(
          offlineOrderQueries.savedOrder(orderId),
        )

        if (!restoreSavedOrderToSession(order)) {
          toast.error("This order has no items available to resume.")
          return false
        }

        router.push("/offline-order/payment")
        return true
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "Failed to load saved order."

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

      router.push("/offline-order/payment")
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
