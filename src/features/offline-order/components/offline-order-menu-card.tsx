"use client"

import Image from "next/image"

import type { ApiSalesDashboardMenuItem, OfflineOrderCartItem } from "@/features/offline-order/types"
import { getCartItemAddonSummary } from "@/features/offline-order/utils/cart-line"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { toImageSrc } from "@/lib/image-url"
import { cn } from "@/lib/utils"

type OfflineOrderMenuCardProps = {
  item: ApiSalesDashboardMenuItem
  quantity: number
  hasAddonOptions: boolean
  cartLines?: OfflineOrderCartItem[]
  onCardClick: () => void
  onAdd: () => void
  onQuantityChange: (quantity: number) => void
}

function QuantityControls({
  quantity,
  onDecrease,
  onIncrease,
  label,
  decreaseLabel,
  increaseLabel,
}: {
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
  label?: string
  decreaseLabel: string
  increaseLabel: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      {label ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : null}
      <div className="ml-auto flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="border-primary text-primary"
          onClick={(event) => {
            event.stopPropagation()
            onDecrease()
          }}
          aria-label={decreaseLabel}
        >
          <Icons.remove size={16} />
        </Button>
        <span className="min-w-6 text-center text-sm font-semibold">
          {quantity}
        </span>
        <Button
          type="button"
          variant="default"
          size="icon-sm"
          onClick={(event) => {
            event.stopPropagation()
            onIncrease()
          }}
          aria-label={increaseLabel}
        >
          <Icons.add size={16} />
        </Button>
      </div>
    </div>
  )
}

function AddToOrderButton({
  itemName,
  onAdd,
}: {
  itemName: string
  onAdd: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-muted-foreground">Add to Order</span>
      <Button
        type="button"
        size="icon-sm"
        onClick={(event) => {
          event.stopPropagation()
          onAdd()
        }}
        aria-label={`Add ${itemName} to order`}
      >
        <Icons.add size={16} />
      </Button>
    </div>
  )
}

export function OfflineOrderMenuCard({
  item,
  quantity,
  hasAddonOptions,
  cartLines = [],
  onCardClick,
  onAdd,
  onQuantityChange,
}: OfflineOrderMenuCardProps) {
  const isSelected = quantity > 0
  const addonLine = [...cartLines]
    .reverse()
    .find((line) => (line.addons?.length ?? 0) > 0)

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden py-0 transition-shadow",
        isSelected && "ring-2 ring-primary",
        hasAddonOptions && "cursor-pointer",
      )}
      onClick={hasAddonOptions ? onCardClick : undefined}
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
          <p className="text-sm text-primary">₦{item.price.toLocaleString()}</p>
        </div>

        {hasAddonOptions ? (
          isSelected ? (
            <div className="space-y-3">
              {addonLine ? (
                <div className="rounded-xl bg-muted/50 px-3 py-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Selected add-ons
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {getCartItemAddonSummary(addonLine.addons)}
                  </p>
                </div>
              ) : null}

              <QuantityControls
                quantity={quantity}
                label="Quantity:"
                decreaseLabel={`Decrease quantity for ${item.name}`}
                increaseLabel={`Increase quantity for ${item.name}`}
                onDecrease={() => onQuantityChange(quantity - 1)}
                onIncrease={() => onQuantityChange(quantity + 1)}
              />
            </div>
          ) : (
            <AddToOrderButton itemName={item.name} onAdd={onAdd} />
          )
        ) : isSelected ? (
          <QuantityControls
            quantity={quantity}
            label="Quantity:"
            decreaseLabel={`Decrease quantity for ${item.name}`}
            increaseLabel={`Increase quantity for ${item.name}`}
            onDecrease={() => onQuantityChange(quantity - 1)}
            onIncrease={() => onQuantityChange(quantity + 1)}
          />
        ) : (
          <AddToOrderButton itemName={item.name} onAdd={onAdd} />
        )}
      </div>
    </Card>
  )
}
