"use client"

import { useState } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Icons } from "@/components/ui/icons"
import { OfflineOrderMenuCard } from "@/features/offline-order/components/offline-order-menu-card"
import { OfflineOrderMenuItemAddonsDialog } from "@/features/offline-order/components/offline-order-menu-item-addons-dialog"
import type {
  ApiSalesDashboardMenuItem,
  OfflineOrderCartAddon,
  OfflineOrderCartItem,
} from "@/features/offline-order/types"
import { buildCartLineId, menuItemHasAddonOptions } from "@/features/offline-order/utils/cart-line"

type OfflineOrderKitchenGroupProps = {
  kitchenName: string
  kitchenId: string
  items: ApiSalesDashboardMenuItem[]
  itemCount: number
  quantityByItemId: Record<string, number>
  cartItems: OfflineOrderCartItem[]
  defaultOpen?: boolean
  onAddItem: (input: {
    itemId: string
    name: string
    basePrice: number
    price: number
    image: string | null
    kitchenId: string
    kitchenName: string
    addons?: OfflineOrderCartAddon[]
  }) => void
  onApplyAddonSelection: (input: {
    itemId: string
    name: string
    basePrice: number
    price: number
    image: string | null
    kitchenId: string
    kitchenName: string
    addons?: OfflineOrderCartAddon[]
  }) => void
  onUpdateLineQuantity: (lineId: string, quantity: number) => void
}

export function OfflineOrderKitchenGroup({
  kitchenName,
  kitchenId,
  items,
  itemCount,
  quantityByItemId,
  cartItems,
  defaultOpen = true,
  onAddItem,
  onApplyAddonSelection,
  onUpdateLineQuantity,
}: OfflineOrderKitchenGroupProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] =
    useState<ApiSalesDashboardMenuItem | null>(null)

  const openAddonsDialog = (item: ApiSalesDashboardMenuItem) => {
    setSelectedItem(item)
    setDialogOpen(true)
  }

  const handleAddSimpleItem = (item: ApiSalesDashboardMenuItem) => {
    onAddItem({
      itemId: String(item.id),
      name: item.name,
      basePrice: item.price,
      price: item.price,
      image: item.image,
      kitchenId,
      kitchenName,
      addons: [],
    })
  }

  const handleNoAddonQuantityChange = (
    item: ApiSalesDashboardMenuItem,
    nextQuantity: number,
  ) => {
    const itemId = String(item.id)
    const lineId = buildCartLineId(itemId, [])
    const existingLine = cartItems.find((line) => line.lineId === lineId)

    if (nextQuantity <= 0) {
      onUpdateLineQuantity(lineId, 0)
      return
    }

    if (!existingLine) {
      handleAddSimpleItem(item)

      if (nextQuantity > 1) {
        onUpdateLineQuantity(lineId, nextQuantity)
      }

      return
    }

    onUpdateLineQuantity(lineId, nextQuantity)
  }

  const handleItemQuantityChange = (
    item: ApiSalesDashboardMenuItem,
    nextQuantity: number,
  ) => {
    const itemId = String(item.id)
    const itemCartLines = cartItems.filter((line) => line.itemId === itemId)
    const addonLine = [...itemCartLines]
      .reverse()
      .find((line) => (line.addons?.length ?? 0) > 0)

    if (nextQuantity <= 0) {
      for (const line of itemCartLines) {
        onUpdateLineQuantity(line.lineId, 0)
      }
      return
    }

    if (addonLine) {
      onUpdateLineQuantity(addonLine.lineId, nextQuantity)
      return
    }

    handleNoAddonQuantityChange(item, nextQuantity)
  }

  return (
    <>
      <Collapsible className="group/collapsible" defaultOpen={defaultOpen}>
        <div className="flex w-full items-center gap-2 py-1">
          <CollapsibleTrigger className="flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-muted">
            <Icons.chevronDown
              size={20}
              className="text-muted-foreground transition-transform group-data-[state=closed]/collapsible:-rotate-90"
            />
          </CollapsibleTrigger>

          <span className="text-base font-semibold text-foreground">
            {kitchenName}
          </span>
          <span className="text-sm text-muted-foreground">({itemCount} items)</span>
        </div>

        <CollapsibleContent className="pt-4">
          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No menu items found for this kitchen.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => {
                const itemId = String(item.id)
                const itemCartLines = cartItems.filter(
                  (line) => line.itemId === itemId,
                )
                const hasAddonOptions = menuItemHasAddonOptions(item)

                return (
                  <OfflineOrderMenuCard
                    key={item.id}
                    item={item}
                    quantity={quantityByItemId[itemId] ?? 0}
                    hasAddonOptions={hasAddonOptions}
                    cartLines={itemCartLines}
                    onCardClick={() => openAddonsDialog(item)}
                    onAdd={() => handleAddSimpleItem(item)}
                    onQuantityChange={(nextQuantity) =>
                      handleItemQuantityChange(item, nextQuantity)
                    }
                  />
                )
              })}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      <OfflineOrderMenuItemAddonsDialog
        open={dialogOpen}
        item={selectedItem}
        cartLines={
          selectedItem
            ? cartItems.filter((line) => line.itemId === String(selectedItem.id))
            : []
        }
        kitchenId={kitchenId}
        kitchenName={kitchenName}
        onOpenChange={setDialogOpen}
        onApply={onApplyAddonSelection}
      />
    </>
  )
}
