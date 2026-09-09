"use client"

import { useMemo } from "react"

import type { OfflineOrderSavedSort, SalesDashboardOrdersParams } from "../types"
import { useSalesDashboardSavedOrdersQuery } from "./use-offline-order-queries"
import { sortSalesDashboardOrders } from "../utils/sales-dashboard-order"

export function useSalesDashboardSavedOrders(
  params: SalesDashboardOrdersParams = {},
  options?: { enabled?: boolean },
) {
  const query = useSalesDashboardSavedOrdersQuery(
    { per_page: 50, ...params },
    options,
  )

  const savedOrders = query.data?.data ?? []
  const savedOrderCount =
    query.data?.saved_orders_count ?? savedOrders.length

  return {
    ...query,
    savedOrders,
    savedOrderCount,
  }
}

export function useSalesDashboardSavedOrdersSorted(
  params: SalesDashboardOrdersParams & { sort?: OfflineOrderSavedSort } = {},
  options?: { enabled?: boolean },
) {
  const { sort = "time_saved", ...queryParams } = params
  const result = useSalesDashboardSavedOrders(queryParams, options)

  const savedOrders = useMemo(
    () => sortSalesDashboardOrders(result.savedOrders, sort),
    [result.savedOrders, sort],
  )

  return {
    ...result,
    savedOrders,
    savedOrderCount: savedOrders.length,
  }
}
