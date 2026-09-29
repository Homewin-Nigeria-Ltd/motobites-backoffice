"use client"

import { useMemo, useState } from "react"

import { AppLoader } from "@/components/ui/app-loader"
import { Input } from "@/components/ui/input"
import { OfflineOrderBackButton } from "@/features/offline-order/components/offline-order-back-button"
import { useDebouncedSearch } from "@/features/restaurant/hooks/use-debounced-search"

import { BulkOrderItemScroller } from "../components/bulk-order-item-scroller"
import { BulkOrderKitchenTabs } from "../components/bulk-order-kitchen-tabs"
import { BulkOrderSourceSelect } from "../components/bulk-order-source-select"
import { BulkOrderSummaryBar } from "../components/bulk-order-summary-bar"
import { ALL_BULK_ORDER_KITCHEN_ID } from "../constants"
import { useBulkOrderCart } from "../hooks/use-bulk-order-cart"
import { useBulkOrderItems } from "../hooks/use-bulk-order-queries"
import type { BulkOrderCatalogItem } from "../types"
import {
  filterBulkOrderCatalog,
  getBulkOrderAddonSections,
} from "../utils/catalog"
import { getBulkOrderKitchensFromItems } from "../utils/map-items"

export function BulkOrderSection() {
  const [selectedKitchenId, setSelectedKitchenId] = useState(
    ALL_BULK_ORDER_KITCHEN_ID,
  )
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const { value: search, setValue: setSearch, debouncedValue } =
    useDebouncedSearch("")
  const {
    source,
    setSource,
    quantityByItemId,
    portionCount,
    sideCount,
    subtotal,
    addItem,
    updateQuantity,
  } = useBulkOrderCart()
  const searchQuery = debouncedValue?.trim() || undefined
  const kitchenId =
    selectedKitchenId !== ALL_BULK_ORDER_KITCHEN_ID
      ? Number(selectedKitchenId)
      : undefined

  const {
    data: catalogItems = [],
    isPending,
    isError,
    error,
  } = useBulkOrderItems({
    search: searchQuery,
    kitchen_id:
      kitchenId && Number.isFinite(kitchenId) ? kitchenId : undefined,
  })

  const kitchenTabs = useMemo(
    () => getBulkOrderKitchensFromItems(catalogItems),
    [catalogItems],
  )

  const menuItems = useMemo(
    () =>
      filterBulkOrderCatalog(
        catalogItems,
        searchQuery ?? "",
        selectedKitchenId,
      ),
    [catalogItems, searchQuery, selectedKitchenId],
  )
  const selectedItem = menuItems.find((item) => item.id === selectedItemId)
  const addonSections = useMemo(
    () => getBulkOrderAddonSections(selectedItem, []),
    [selectedItem],
  )

  const handleSelectItem = (item: BulkOrderCatalogItem) => {
    setSelectedItemId((current) => (current === item.id ? null : item.id))
  }

  const handleAddItem = (item: BulkOrderCatalogItem) => {
    addItem(item)
    setSelectedItemId(item.id)
  }

  if (isError) {
    throw error
  }

  return (
    <div className="bg-muted">
      <OfflineOrderBackButton href="/offline-order" label="Back to Overview" />

      <div className="sticky top-0 z-30 border-b border-border/50 bg-background px-4 py-4 shadow-sm md:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl flex-1">
              <Input
                type="search"
                icon={{ name: "search", position: "left" }}
                placeholder="Search for bulk pans and portions..."
                className="h-10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <BulkOrderSourceSelect value={source} onChange={setSource} />
          </div>

          {kitchenTabs.length > 0 ? (
            <BulkOrderKitchenTabs
              kitchens={kitchenTabs}
              value={
                kitchenTabs.some((kitchen) => kitchen.id === selectedKitchenId)
                  ? selectedKitchenId
                  : ALL_BULK_ORDER_KITCHEN_ID
              }
              onChange={setSelectedKitchenId}
            />
          ) : null}
        </div>
      </div>

      <div className="space-y-8 px-4 py-6 md:px-6">
        {isPending ? (
          <AppLoader />
        ) : menuItems.length === 0 ? (
          <div className="flex items-center justify-center rounded-2xl border border-border bg-background p-12 text-center">
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? `No bulk items found for "${search}".`
                : "No menu items available for bulk orders."}
            </p>
          </div>
        ) : (
          <>
            <BulkOrderItemScroller
              items={menuItems}
              quantityByItemId={quantityByItemId}
              selectedItemId={selectedItemId}
              onSelectItem={handleSelectItem}
              onAdd={handleAddItem}
              onQuantityChange={updateQuantity}
            />

            {selectedItemId ? (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Add-ons</h2>
                {addonSections.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No add-ons for this item.
                  </p>
                ) : (
                  addonSections.map((group) => (
                    <section key={group.id} className="space-y-3">
                      <h3 className="text-base font-semibold text-foreground">
                        {group.title}
                      </h3>
                      <BulkOrderItemScroller
                        items={group.items}
                        quantityByItemId={quantityByItemId}
                        onAdd={addItem}
                        onQuantityChange={updateQuantity}
                      />
                    </section>
                  ))
                )}
              </div>
            ) : null}
          </>
        )}
      </div>

      <BulkOrderSummaryBar
        portionCount={portionCount}
        sideCount={sideCount}
        subtotal={subtotal}
      />
    </div>
  )
}
