"use client"

import { useMemo } from "react"

import {
  useOrders,
  useOrderSearchQuery,
  useOrderTabCounts,
} from "@/features/order/hooks/use-order-queries"
import type { ApiOrder } from "@/features/order/types"
import type { DeliveryTab } from "@/features/delivery-management/types"

function filterOrdersByDeliveryTab(orders: ApiOrder[], tab: DeliveryTab) {
  if (tab === "unassigned") {
    return orders.filter((order) => !order.rider_name)
  }

  if (tab === "ongoing") {
    return orders.filter((order) => Boolean(order.rider_name))
  }

  return orders
}

function getOrderTabForDelivery(tab: DeliveryTab) {
  switch (tab) {
    case "all":
    case "unassigned":
    case "ongoing":
      return "transit" as const
    case "completed":
      return "completed" as const
    case "riders":
      return "transit" as const
  }
}

export function useDeliveryTabCounts() {
  const { counts: orderCounts } = useOrderTabCounts()
  const search = useOrderSearchQuery()
  const transitQuery = useOrders({ tab: "transit", search })

  return useMemo(() => {
    const transitOrders =
      transitQuery.data?.groups.flatMap((group) => group.orders) ?? []

    return {
      all: transitOrders.length,
      unassigned: transitOrders.filter((order) => !order.rider_name).length,
      ongoing: transitOrders.filter((order) => Boolean(order.rider_name)).length,
      completed: orderCounts.completed,
    } satisfies Partial<Record<DeliveryTab, number>>
  }, [orderCounts.completed, transitQuery.data?.groups])
}

export function useDeliveryOrders(tab: DeliveryTab) {
  const search = useOrderSearchQuery()
  const orderTab = getOrderTabForDelivery(tab)
  const query = useOrders({ tab: orderTab, search })

  const orders = useMemo(() => {
    const groupedOrders =
      query.data?.groups.flatMap((group) => group.orders) ?? []

    return filterOrdersByDeliveryTab(groupedOrders, tab)
  }, [query.data?.groups, tab])

  return {
    ...query,
    orders,
  }
}
