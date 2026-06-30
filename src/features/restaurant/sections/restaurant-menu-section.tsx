"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"

import {
  useKitchenMenuItems,
} from "@/features/restaurant/hooks/use-restaurant-queries"
import { useDebouncedSearch } from "@/features/restaurant/hooks/use-debounced-search"
import { mapApiMenuItemToMenu } from "@/features/restaurant/utils/menu-item"
import { MenuCardGrid } from "@/features/restaurant/components/menu-card-grid"
import { MenuCardList } from "@/features/restaurant/components/menu-card-list"
import { AddMenuSheet } from "@/features/restaurant/components/add-menu-sheet"
import { RestaurantFormModal } from "@/features/restaurant/components/restaurant-form-modal"
import { useRestaurant } from "@/features/restaurant"
import { PaginationControls } from "@/components/pagination-controls"
import { Button } from "@/components/ui/button"
import { AppLoader } from "@/components/ui/app-loader"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type RestaurantMenuSectionProps = {
  restaurantId: string
}

function RestaurantMenuSectionContent({
  restaurantId,
}: RestaurantMenuSectionProps) {
  const { data: restaurant, isPending: isKitchenPending } =
    useRestaurant(restaurantId)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [searchSeed, setSearchSeed] = useState("")
  const [editRestaurantOpen, setEditRestaurantOpen] = useState(false)
  const [menuSheetOpen, setMenuSheetOpen] = useState(false)
  const [editingMenuItemId, setEditingMenuItemId] = useState<string>()
  const { value: search, setValue: setSearch, debouncedValue } =
    useDebouncedSearch()

  if (debouncedValue !== searchSeed) {
    setSearchSeed(debouncedValue)
    setPage(1)
  }

  const {
    data: itemsResponse,
    isPending: isItemsPending,
    isError,
    error,
  } = useKitchenMenuItems({
    kitchenId: restaurantId,
    search: debouncedValue,
    page,
  })

  const items = itemsResponse?.data ?? []
  const menus = items.map(mapApiMenuItemToMenu)
  const meta = itemsResponse?.meta
  const totalPages = meta?.last_page ?? 1
  const currentPage = meta?.current_page ?? page

  if (!isKitchenPending && !restaurant) {
    notFound()
  }

  if (isError) {
    throw error
  }

  if (!restaurant) {
    return <AppLoader className="flex-1 bg-muted p-12" />
  }

  const isLoading = isItemsPending && menus.length === 0

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="border-b border-border/50 bg-background px-4 py-4 md:px-6">
        <div className="mb-4">
          <Link
            href="/kitchen"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <span aria-hidden>←</span>
            All kitchens
          </Link>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl flex-1">
            <Input
              type="search"
              icon={{ name: "search", position: "left" }}
              placeholder="Search menu items"
              className="h-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1">
              <Button
                type="button"
                variant={view === "list" ? "secondary" : "ghost"}
                size="icon"
                className="size-9"
                icon={{ name: "list", position: "left" }}
                onClick={() => setView("list")}
                aria-label="List view"
                aria-pressed={view === "list"}
              />
              <Button
                type="button"
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="size-9"
                icon={{ name: "gridView", position: "left" }}
                onClick={() => setView("grid")}
                aria-label="Grid view"
                aria-pressed={view === "grid"}
              />
            </div>
            <Button
              type="button"
              className="h-10 px-4"
              icon={{ name: "add", position: "left" }}
              onClick={() => {
                setEditingMenuItemId(undefined)
                setMenuSheetOpen(true)
              }}
            >
              Add New Item
            </Button>
            <Button
              type="button"
              className="h-10 px-4"
              icon={{ name: "edit", position: "left" }}
              onClick={() => setEditRestaurantOpen(true)}
            >
              Edit Kitchen
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            {restaurant.name}
          </h2>

          {isLoading ? (
            <AppLoader />
          ) : menus.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-border bg-background p-12 text-center">
              <p className="text-sm text-muted-foreground">
                {debouncedValue
                  ? `No menu items found for "${debouncedValue}".`
                  : "No menu items found for this kitchen."}
              </p>
            </div>
          ) : view === "grid" ? (
            <div
              className={cn(
                "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                isItemsPending && "opacity-60"
              )}
            >
              {menus.map((menu) => (
                <MenuCardGrid
                  key={menu.id}
                  menu={menu}
                  hubId={restaurantId}
                  onEditItem={(menuId) => {
                    setEditingMenuItemId(menuId)
                    setMenuSheetOpen(true)
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className={cn(
                "flex flex-col gap-6",
                isItemsPending && "opacity-60"
              )}
            >
              {menus.map((menu) => (
                <MenuCardList
                  key={menu.id}
                  menu={menu}
                  hubId={restaurantId}
                  onEditItem={(menuId) => {
                    setEditingMenuItemId(menuId)
                    setMenuSheetOpen(true)
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {!isLoading && totalPages > 1 ? (
          <div className="flex shrink-0 justify-center border-t border-border/60 bg-background px-4 py-4 md:px-6">
            <PaginationControls
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </div>

      <RestaurantFormModal
        open={editRestaurantOpen}
        onOpenChange={setEditRestaurantOpen}
        kitchenId={restaurantId}
      />

      <AddMenuSheet
        open={menuSheetOpen}
        onOpenChange={(open) => {
          setMenuSheetOpen(open)
          if (!open) {
            setEditingMenuItemId(undefined)
          }
        }}
        menuItemId={editingMenuItemId}
        defaultKitchenId={restaurantId}
      />
    </div>
  )
}

export function RestaurantMenuSection({ restaurantId }: RestaurantMenuSectionProps) {
  return (
    <RestaurantMenuSectionContent key={restaurantId} restaurantId={restaurantId} />
  )
}
