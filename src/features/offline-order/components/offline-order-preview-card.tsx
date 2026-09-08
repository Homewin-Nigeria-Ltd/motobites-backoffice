"use client"

import Image from "next/image"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { OfflineOrderCartItem } from "@/features/offline-order/types"
import { formatOfflineOrderAmount } from "@/features/offline-order/utils/order-totals"
import { toImageSrc } from "@/lib/image-url"

type OfflineOrderPreviewCardProps = {
  items: OfflineOrderCartItem[]
  subtotal: number
  serviceFee: number
  total: number
}

export function OfflineOrderPreviewCard({
  items,
  subtotal,
  serviceFee,
  total,
}: OfflineOrderPreviewCardProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="border-b border-border/60 px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">
          Order Preview
        </h2>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.lineId} className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={toImageSrc(item.image)}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {item.name}{" "}
                    <span className="text-muted-foreground">(x{item.quantity})</span>
                  </p>
                  {(item.addons ?? []).map((addon) => (
                    <p key={addon.id} className="text-xs text-muted-foreground">
                      {addon.name}
                    </p>
                  ))}
                </div>
              </div>
              <span className="shrink-0 text-sm font-medium">
                {formatOfflineOrderAmount(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatOfflineOrderAmount(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Service Fee</span>
            <span>{formatOfflineOrderAmount(serviceFee)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total</span>
          <span className="text-2xl font-semibold text-primary">
            {formatOfflineOrderAmount(total)}
          </span>
        </div>
      </div>
    </Card>
  )
}
