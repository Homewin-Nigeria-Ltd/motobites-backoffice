"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { formatOfflineOrderAmount } from "@/features/offline-order/utils/order-totals"

type BulkOrderSummaryBarProps = {
  portionCount: number
  sideCount: number
  subtotal: number
}

export function BulkOrderSummaryBar({
  portionCount,
  sideCount,
  subtotal,
}: BulkOrderSummaryBarProps) {
  if (portionCount + sideCount === 0) {
    return null
  }

  const allocationLabel = [
    portionCount > 0
      ? `${portionCount} Portion${portionCount === 1 ? "" : "s"}`
      : null,
    sideCount > 0 ? `${sideCount} Side${sideCount === 1 ? "" : "s"}` : null,
  ]
    .filter(Boolean)
    .join(" & ")

  return (
    <div className="sticky bottom-0 z-10 border-t border-border/60 bg-background px-4 py-4 md:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {allocationLabel} Allocated
          </p>
          <p className="text-sm text-muted-foreground">
            Estimated Total:{" "}
            <span className="font-semibold text-primary">
              {formatOfflineOrderAmount(subtotal)}
            </span>
          </p>
        </div>

        <Button asChild className="h-11 px-6">
          <Link href="/offline-order/bulk/review">Continue to Review</Link>
        </Button>
      </div>
    </div>
  )
}
