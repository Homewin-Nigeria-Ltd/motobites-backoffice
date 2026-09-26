"use client"

import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { formatOfflineOrderAmount } from "@/features/offline-order/utils/order-totals"
import { toImageSrc } from "@/lib/image-url"
import { cn } from "@/lib/utils"

import type { BulkOrderCatalogItem } from "../types"

type BulkOrderMenuCardProps = {
  item: BulkOrderCatalogItem
  quantity: number
  selected?: boolean
  onSelect?: () => void
  onAdd: () => void
  onQuantityChange: (quantity: number) => void
}

export function BulkOrderMenuCard({
  item,
  quantity,
  selected = false,
  onSelect,
  onAdd,
  onQuantityChange,
}: BulkOrderMenuCardProps) {
  const isSelected = selected || quantity > 0

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden py-0",
        onSelect && "cursor-pointer",
        isSelected && "ring-2 ring-primary",
      )}
      onClick={onSelect}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted">
        <Image
          src={toImageSrc(item.image)}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-3 px-4 py-4">
        <div className="space-y-1">
          <h3
            className="truncate text-base font-semibold text-foreground"
            title={item.name}
          >
            {item.name}
          </h3>
          <p className="text-sm text-primary">
            {formatOfflineOrderAmount(item.price)}
          </p>
        </div>

        {quantity > 0 ? (
          <div
            className="flex items-center justify-between gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="text-sm text-muted-foreground">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="border-primary text-primary"
                onClick={() => onQuantityChange(quantity - 1)}
                aria-label={`Decrease quantity for ${item.name}`}
              >
                <Icons.remove size={16} />
              </Button>
              <span className="min-w-6 text-center text-sm font-semibold">
                {quantity}
              </span>
              <Button
                type="button"
                size="icon-sm"
                onClick={() => onQuantityChange(quantity + 1)}
                aria-label={`Increase quantity for ${item.name}`}
              >
                <Icons.add size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-between gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="text-sm text-muted-foreground">Add to Order</span>
            <Button
              type="button"
              size="icon-sm"
              onClick={onAdd}
              aria-label={`Add ${item.name} to bulk order`}
            >
              <Icons.add size={16} />
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
