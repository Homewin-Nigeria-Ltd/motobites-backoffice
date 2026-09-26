"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatOfflineOrderAmount } from "@/features/offline-order/utils/order-totals"

import { BULK_ORDER_SERVICE_TAX_RATE } from "../constants"

type BulkOrderInvoiceCardProps = {
  subtotal: number
  tax?: number
  total?: number
  discount?: number
  discountPercentage?: number
  isPreviewing?: boolean
}

export function BulkOrderInvoiceCard({
  subtotal,
  tax,
  total,
  discount = 0,
  discountPercentage = 0,
  isPreviewing = false,
}: BulkOrderInvoiceCardProps) {
  const serviceTax =
    typeof tax === "number"
      ? tax
      : Math.round(subtotal * BULK_ORDER_SERVICE_TAX_RATE)
  const invoiceTotal =
    typeof total === "number" ? total : subtotal - discount + serviceTax
  const taxPercent = Math.round(BULK_ORDER_SERVICE_TAX_RATE * 100)

  return (
    <Card className="max-w-md gap-0 overflow-hidden py-0">
      <div className="border-b border-border/60 px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">
          Corporate Invoice
        </h2>
      </div>
      <div className="space-y-4 px-5 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatOfflineOrderAmount(subtotal)}</span>
        </div>
        {discount > 0 ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Discount
              {discountPercentage > 0 ? ` (${discountPercentage}%)` : ""}
            </span>
            <span className="font-medium">
              -{formatOfflineOrderAmount(discount)}
            </span>
          </div>
        ) : null}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Bulk Service Tax ({taxPercent}%)
          </span>
          <span className="font-medium">{formatOfflineOrderAmount(serviceTax)}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Total Amount
          </span>
          <span className="text-2xl font-semibold text-primary">
            {formatOfflineOrderAmount(invoiceTotal)}
          </span>
        </div>
        <Button asChild className="h-11 w-full" disabled={isPreviewing}>
          <Link href="/offline-order/bulk/payment">Proceed to Payment</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 w-full">
          <Link href="/offline-order/bulk">Go Back</Link>
        </Button>
      </div>
    </Card>
  )
}
