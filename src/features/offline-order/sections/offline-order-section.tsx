"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import { OfflineOrderBackButton } from "@/features/offline-order/components/offline-order-back-button"
import { OfflineOrderKitchenGroup } from "@/features/offline-order/components/offline-order-kitchen-group"
import {
  ALL_KITCHENS_TAB_VALUE,
  OfflineOrderKitchenTabs,
} from "@/features/offline-order/components/offline-order-kitchen-tabs"
import { OfflineOrderSummaryBar } from "@/features/offline-order/components/offline-order-summary-bar"
import { useOfflineOrderCart } from "@/features/offline-order/hooks/use-offline-order-cart"
import { useSalesDashboardKitchens } from "@/features/offline-order/hooks/use-offline-order-queries"
import { useSalesDashboardSavedOrders } from "@/features/offline-order/hooks/use-sales-dashboard-saved-orders"
import type { OfflineOrderSort } from "@/features/offline-order/types"
import { filterSalesDashboardMenuItems } from "@/features/offline-order/utils/filter-menu-items"
import { sortSalesDashboardMenuItems } from "@/features/offline-order/utils/sort-menu-items"
import { useDebouncedSearch } from "@/features/restaurant/hooks/use-debounced-search"

const sortOptions = [
  { label: "Latest Added", value: "latest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name", value: "name" },
] as const satisfies ReadonlyArray<{
  label: string
  value: OfflineOrderSort
}>

export function OfflineOrderSection() {
  const [selectedKitchenId, setSelectedKitchenId] = useState(ALL_KITCHENS_TAB_VALUE)
  const { value: search, setValue: setSearch, debouncedValue } =
    useDebouncedSearch("")
  const [sort, setSort] = useState<OfflineOrderSort>("latest")
  const {
    items: cartItems,
    selectedCount,
    subtotal,
    quantityByItemId,
    addItem,
    applyAddonSelection,
    updateQuantity,
  } = useOfflineOrderCart()
  const { savedOrderCount } = useSalesDashboardSavedOrders()

  const {
    data: kitchens = [],
    isPending: isKitchensPending,
    isError: isKitchensError,
    error: kitchensError,
  } = useSalesDashboardKitchens()

  const activeKitchenId = useMemo(() => {
    if (selectedKitchenId === ALL_KITCHENS_TAB_VALUE) {
      return selectedKitchenId
    }

    if (kitchens.length === 0) {
      return selectedKitchenId
    }

    return kitchens.some((kitchen) => String(kitchen.id) === selectedKitchenId)
      ? selectedKitchenId
      : ALL_KITCHENS_TAB_VALUE
  }, [kitchens, selectedKitchenId])

  const searchQuery = debouncedValue?.trim() || undefined

  const kitchenGroups = useMemo(() => {
    const visibleKitchens =
      activeKitchenId === ALL_KITCHENS_TAB_VALUE
        ? kitchens
        : kitchens.filter((kitchen) => String(kitchen.id) === activeKitchenId)

    return visibleKitchens.map((kitchen) => ({
      kitchen,
      items: sortSalesDashboardMenuItems(
        filterSalesDashboardMenuItems(kitchen.menu_items ?? [], searchQuery),
        sort,
      ),
    }))
  }, [kitchens, activeKitchenId, searchQuery, sort])

  const totalVisibleItems = kitchenGroups.reduce(
    (count, group) => count + group.items.length,
    0,
  )

  const currentSortLabel =
    sortOptions.find((option) => option.value === sort)?.label ?? sort
  const isError = isKitchensError
  const error = kitchensError

  if (isError) {
    throw error
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <OfflineOrderBackButton href="/offline-order" label="Back to Overview" />

      {savedOrderCount > 0 ? (
        <div className="border-b border-primary/20 bg-primary/5 px-4 py-3 md:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {savedOrderCount} saved order{savedOrderCount === 1 ? "" : "s"}{" "}
              waiting to be completed.
            </p>
            <Button asChild variant="link" className="h-auto p-0 text-primary">
              <Link href="/offline-order/saved">View Saved Orders</Link>
            </Button>
          </div>
        </div>
      ) : null}

      <div className="border-b border-border/50 bg-background px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl flex-1">
              <Input
                type="search"
                icon={{ name: "search", position: "left" }}
                placeholder="Search for food items and combos..."
                className="h-10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 px-3 text-sm text-muted-foreground"
                >
                  Sort by:{" "}
                  <span className="ml-1 font-medium text-foreground">
                    {currentSortLabel}
                  </span>
                  <Icons.chevronDown size={16} className="ml-2 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onSelect={() => setSort(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <OfflineOrderKitchenTabs
            kitchens={kitchens}
            value={activeKitchenId}
            onChange={setSelectedKitchenId}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-4 py-6 md:px-6">
          {isKitchensPending ? (
            <AppLoader />
          ) : kitchens.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-border bg-background p-12 text-center">
              <p className="text-sm text-muted-foreground">
                No kitchens available for offline orders.
              </p>
            </div>
          ) : totalVisibleItems === 0 && searchQuery ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-border bg-background p-12 text-center">
              <p className="text-sm text-muted-foreground">
                {`No menu items found for "${search}".`}
              </p>
            </div>
          ) : (
            kitchenGroups.map(({ kitchen, items }) => (
              <OfflineOrderKitchenGroup
                key={kitchen.id}
                kitchenId={String(kitchen.id)}
                kitchenName={kitchen.name}
                items={items}
                itemCount={
                  kitchen.menu_items_count ??
                  kitchen.menu_items?.length ??
                  items.length
                }
                defaultOpen
                quantityByItemId={quantityByItemId}
                cartItems={cartItems}
                onAddItem={addItem}
                onApplyAddonSelection={applyAddonSelection}
                onUpdateLineQuantity={updateQuantity}
              />
            ))
          )}
        </div>

        <OfflineOrderSummaryBar
          selectedCount={selectedCount}
          subtotal={subtotal}
        />
      </div>
    </div>
  )
}
