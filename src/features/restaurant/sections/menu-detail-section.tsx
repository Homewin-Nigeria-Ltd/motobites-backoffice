"use client"

import Link from "next/link"
import { useState } from "react"

import { PageHeader } from "@/components/layouts/dashboard"
import { AddMenuSheet } from "@/features/restaurant/components/add-menu-sheet"
import { MenuItemDetailsModal } from "@/features/restaurant/components/menu-item-details-modal"
import { MenuItemsTable } from "@/features/restaurant/components/menu-items-table"
import {
  useKitchenMenuItems,
} from "@/features/restaurant/hooks/use-restaurant-queries"
import { useDebouncedSearch } from "@/features/restaurant/hooks/use-debounced-search"
import { mapApiMenuItemToMenuDetailItem } from "@/features/restaurant/utils/menu-item"
import { buildRestaurantMenuHref, useRestaurant } from "@/features/restaurant"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AppLoader } from "@/components/ui/app-loader"

type MenuDetailSectionProps = {
  kitchenId: string
}

export function MenuDetailSection({ kitchenId }: MenuDetailSectionProps) {
  const [detailsMenuId, setDetailsMenuId] = useState<string | null>(null)
  const { data: kitchen, isPending: isKitchenPending } = useRestaurant(kitchenId)
  const { value: search, setValue: setSearch, debouncedValue } =
    useDebouncedSearch()

  const {
    data: itemsResponse,
    isPending: isItemsPending,
    isError,
    error,
  } = useKitchenMenuItems({
    kitchenId,
    search: debouncedValue,
    per_page: 50,
  })

  const items = (itemsResponse?.data ?? []).map(mapApiMenuItemToMenuDetailItem)

  if (isKitchenPending) {
    return <AppLoader className="flex-1 bg-muted p-12" />
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <PageHeader
        title="Restaurant Management"
        description="Allow restaurants to update their virtual menus, add new items, or mark certain items as unavailable."
        breadcrumbs={[
          { label: "Overview", href: "/dashboard" },
          { label: "Kitchens", href: "/kitchen" },
          { label: kitchen?.name ?? "Kitchen" },
        ]}
      />

      <div className="border-b border-border/50 bg-background px-4 py-4 md:px-6">
        <div className="mb-4">
          <Link
            href={buildRestaurantMenuHref(kitchenId)}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <span aria-hidden>←</span>
            Menu items
          </Link>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <Badge
              variant="secondary"
              className="h-auto px-4 py-1.5 text-sm font-medium"
            >
              Menu
            </Badge>
            <div className="max-w-2xl flex-1">
              <Input
                type="search"
                icon={{ name: "search", position: "left" }}
                placeholder="Search for Menus and combos"
                className="h-10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          <AddMenuSheet
            defaultKitchenId={kitchenId}
            trigger={
              <Button
                className="h-10 px-4"
                icon={{ name: "add", position: "left" }}
              >
                Add New Item
              </Button>
            }
          />
        </div>
      </div>

      <div className="flex-1 space-y-6 px-4 py-6 md:px-6">
        {isItemsPending && items.length === 0 ? (
          <AppLoader className="min-h-48 rounded-xl border border-border bg-background" />
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center rounded-xl border border-border bg-background p-12 text-center">
            <p className="text-sm text-muted-foreground">
              {debouncedValue
                ? `No menu items found for "${debouncedValue}".`
                : "No menu items found for this kitchen."}
            </p>
          </div>
        ) : (
          <MenuItemsTable
            items={items}
            kitchenId={kitchenId}
            onViewDetails={setDetailsMenuId}
          />
        )}
      </div>

      <MenuItemDetailsModal
        menuItemId={detailsMenuId}
        open={detailsMenuId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDetailsMenuId(null)
          }
        }}
      />
    </div>
  )
}
