import { mapOfflineOrderPreviewTotals } from "@/features/offline-order/utils/order-totals"

import type { ApiBulkOrderPreview, BulkOrderPreviewTotals } from "../types"

export function mapBulkOrderPreviewTotals(
  preview: ApiBulkOrderPreview | null | undefined,
  fallbackSubtotal: number,
): BulkOrderPreviewTotals {
  const base = mapOfflineOrderPreviewTotals(preview ?? {}, fallbackSubtotal)
  const serviceFee = 0
  const total = Math.max(0, base.subtotal - base.discount)
  const allocation = preview?.allocation
  const allocationValid =
    allocation?.valid ??
    allocation?.allocation_valid ??
    preview?.allocation_valid
  const allocationMessage =
    allocation?.message ??
    allocation?.allocation_message ??
    preview?.allocation_message
  const portionCount =
    allocation?.portion_count ?? preview?.portion_count
  const sideCount = allocation?.side_count ?? preview?.side_count

  return {
    subtotal: base.subtotal,
    discount: base.discount,
    discountPercentage: base.discountPercentage,
    serviceFee,
    total,
    allocationValid,
    allocationMessage,
    portionCount,
    sideCount,
  }
}
