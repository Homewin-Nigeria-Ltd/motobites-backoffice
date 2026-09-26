"use client"

import type { BulkOrderCatalogItem } from "../types"
import { BulkOrderMenuCard } from "./bulk-order-menu-card"

type BulkOrderItemScrollerProps = {
  items: BulkOrderCatalogItem[]
  quantityByItemId: Record<string, number>
  selectedItemId?: string | null
  onSelectItem?: (item: BulkOrderCatalogItem) => void
  onAdd: (item: BulkOrderCatalogItem) => void
  onQuantityChange: (itemId: string, quantity: number) => void
}

export function BulkOrderItemScroller({
  items,
  quantityByItemId,
  selectedItemId,
  onSelectItem,
  onAdd,
  onQuantityChange,
}: BulkOrderItemScrollerProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => (
        <div key={item.id} className="w-56 shrink-0">
          <BulkOrderMenuCard
            item={item}
            quantity={quantityByItemId[item.id] ?? 0}
            selected={selectedItemId === item.id}
            onSelect={onSelectItem ? () => onSelectItem(item) : undefined}
            onAdd={() => onAdd(item)}
            onQuantityChange={(quantity) => onQuantityChange(item.id, quantity)}
          />
        </div>
      ))}
    </div>
  )
}
