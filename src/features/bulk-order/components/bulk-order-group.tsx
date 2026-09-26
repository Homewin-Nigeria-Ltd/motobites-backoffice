"use client"

import type { BulkOrderCatalogGroup, BulkOrderCatalogItem } from "../types"
import { BulkOrderMenuCard } from "./bulk-order-menu-card"

type BulkOrderGroupProps = {
  group: BulkOrderCatalogGroup
  quantityByItemId: Record<string, number>
  selectedItemId?: string | null
  onSelectItem?: (item: BulkOrderCatalogItem) => void
  onAdd: (item: BulkOrderCatalogItem) => void
  onQuantityChange: (itemId: string, quantity: number) => void
}

export function BulkOrderGroup({
  group,
  quantityByItemId,
  selectedItemId,
  onSelectItem,
  onAdd,
  onQuantityChange,
}: BulkOrderGroupProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-foreground">{group.title}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {group.items.map((item) => (
          <BulkOrderMenuCard
            key={item.id}
            item={item}
            quantity={quantityByItemId[item.id] ?? 0}
            selected={selectedItemId === item.id}
            onSelect={onSelectItem ? () => onSelectItem(item) : undefined}
            onAdd={() => onAdd(item)}
            onQuantityChange={(quantity) => onQuantityChange(item.id, quantity)}
          />
        ))}
      </div>
    </section>
  )
}
