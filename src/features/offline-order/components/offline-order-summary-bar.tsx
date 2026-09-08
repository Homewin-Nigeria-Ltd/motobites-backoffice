"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

type OfflineOrderSummaryBarProps = {
  selectedCount: number
  subtotal: number
  reviewHref?: string
}

export function OfflineOrderSummaryBar({
  selectedCount,
  subtotal,
  reviewHref = "/offline-order/review",
}: OfflineOrderSummaryBarProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <div className="sticky bottom-0 z-10 border-t border-border/60 bg-background px-4 py-4 md:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {selectedCount} item{selectedCount === 1 ? "" : "s"} selected
          </p>
          <p className="text-sm text-muted-foreground">
            Estimated Subtotal:{" "}
            <span className="font-semibold text-primary">
              ₦{subtotal.toLocaleString()}
            </span>
          </p>
        </div>

        <Button asChild className="h-11 px-6">
          <Link href={reviewHref}>Continue to Review</Link>
        </Button>
      </div>
    </div>
  )
}
