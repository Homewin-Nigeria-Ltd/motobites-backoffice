"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import { offlineOrderQueries } from "../api/queries"
import type { OfflineOrderReceipt } from "../types"
import { mapSalesDashboardOrderToReceipt } from "../utils/map-offline-order-receipt"

export function useOfflineOrderReceiptDetail(orderId: string | null) {
  const query = useQuery({
    ...offlineOrderQueries.order(orderId ?? ""),
    enabled: Boolean(orderId),
  })

  const receipt = useMemo<OfflineOrderReceipt | null>(() => {
    if (!query.data) {
      return null
    }

    return mapSalesDashboardOrderToReceipt(query.data)
  }, [query.data])

  return {
    receipt,
    order: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}
