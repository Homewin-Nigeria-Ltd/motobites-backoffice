"use client"

import type { ReactNode } from "react"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatOfflineOrderAmount } from "@/features/offline-order/utils/order-totals"

type OfflineOrderSummaryCardProps = {
  subtotal: number
  serviceFee: number
  total: number
  children?: ReactNode
}

export function OfflineOrderSummaryCard({
  subtotal,
  serviceFee,
  total,
  children,
}: OfflineOrderSummaryCardProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="border-b border-border/60 px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">
          Order Summary
        </h2>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatOfflineOrderAmount(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Service Fee (Walk-in)</span>
          <span className="font-medium">
            {formatOfflineOrderAmount(serviceFee)}
          </span>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Total Amount
          </span>
          <span className="text-2xl font-semibold text-primary">
            {formatOfflineOrderAmount(total)}
          </span>
        </div>

        {children ? <div className="space-y-3 pt-2">{children}</div> : null}
      </div>
    </Card>
  )
}
