"use client"

import { useMemo } from "react"

import type { SalesDashboardOrdersParams } from "../types"
import { useSalesDashboardOrders } from "./use-offline-order-queries"
import {
  isActiveSalesDashboardOrder,
  isCompletedSalesDashboardOrder,
} from "../utils/sales-dashboard-order"

export function useSalesDashboardOrderLists(
  params: SalesDashboardOrdersParams = {},
  options?: { enabled?: boolean },
) {
  const query = useSalesDashboardOrders(
    { per_page: 50, ...params },
    options,
  )

  const orders = useMemo(
    () => query.data?.data ?? [],
    [query.data?.data],
  )

  const lists = useMemo(
    () => ({
      all: orders,
      active: orders.filter(isActiveSalesDashboardOrder),
      completed: orders.filter(isCompletedSalesDashboardOrder),
    }),
    [orders],
  )

  return {
    ...query,
    orders,
    ...lists,
  }
}
