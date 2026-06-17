"use client"

import { useState } from "react"

import type { ApiOrder } from "../types"

export function useOrderDetailsModal() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const handleViewDetails = (order: ApiOrder) => {
    setSelectedOrderId(order.id)
    setDetailsOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    setDetailsOpen(open)
    if (!open) {
      setSelectedOrderId(null)
    }
  }

  return {
    selectedOrderId,
    detailsOpen,
    handleViewDetails,
    handleOpenChange,
  }
}
