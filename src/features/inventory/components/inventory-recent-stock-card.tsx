"use client"

import type { ApiInventoryItem } from "@/features/inventory/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icons"
import { toImageSrc } from "@/lib/image-url"

type InventoryRecentStockCardProps = {
  items: ApiInventoryItem[]
  onViewItem?: (item: ApiInventoryItem) => void
}

export function InventoryRecentStockCard({
  items,
  onViewItem,
}: InventoryRecentStockCardProps) {
  return (
    <Card className="flex h-full min-w-0 flex-col gap-4 py-5">
      <CardHeader className="px-4 pb-0 sm:px-5">
        <CardTitle className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon name="clock" size={18} />
          </span>
          Recently Stock
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 px-4 pb-5 sm:px-5">
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No recent inventory items.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="hidden grid-cols-[2rem_minmax(0,1fr)_4.5rem_5.5rem_5.5rem] gap-3 px-1 text-xs font-medium text-muted-foreground sm:grid">
              <span />
              <span />
              <span className="text-right">Quantity</span>
              <span className="text-right">Category</span>
              <span className="text-right">Price</span>
            </div>

            <ul className="flex flex-col gap-3">
              {items.map((item, index) => {
                const imageSrc = item.image_url ? toImageSrc(item.image_url) : null

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="grid w-full grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl p-1 text-left transition-colors hover:bg-muted/50 sm:grid-cols-[2rem_minmax(0,1fr)_4.5rem_5.5rem_5.5rem]"
                      onClick={() => onViewItem?.(item)}
                    >
                      <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {index + 1}
                      </span>

                      <div className="flex min-w-0 items-center gap-3">
                        <div className="size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {imageSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imageSrc}
                              alt={item.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-sm font-semibold text-muted-foreground">
                              {item.name.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">
                            {item.name}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">
                            Purchased by {item.purchased_by.name}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground sm:hidden">
                            <span>Qty: {item.quantity}</span>
                            <span>{item.category_label}</span>
                            <span>{item.amount_formatted}</span>
                          </div>
                        </div>
                      </div>

                      <span className="hidden text-right text-sm text-foreground sm:block">
                        {item.quantity}
                      </span>
                      <span className="hidden truncate text-right text-sm text-foreground sm:block">
                        {item.category_label}
                      </span>
                      <span className="hidden text-right text-sm font-medium text-foreground sm:block">
                        {item.amount_formatted}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
