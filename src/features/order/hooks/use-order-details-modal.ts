"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { ORDER_ID_SEARCH_PARAM } from "@/features/order/utils/order-status"
import type { ApiOrder } from "../types"

export function useOrderDetailsModal() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const selectedOrderId = searchParams.get(ORDER_ID_SEARCH_PARAM)
  const detailsOpen = Boolean(selectedOrderId)

  const updateOrderQueryParam = (orderId: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (orderId) {
      params.set(ORDER_ID_SEARCH_PARAM, orderId)
    } else {
      params.delete(ORDER_ID_SEARCH_PARAM)
    }

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const handleViewDetails = (order: ApiOrder) => {
    updateOrderQueryParam(order.id)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      updateOrderQueryParam(null)
    }
  }

  return {
    selectedOrderId,
    detailsOpen,
    handleViewDetails,
    handleOpenChange,
  }
}
