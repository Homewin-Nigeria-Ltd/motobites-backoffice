"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { MenuCardGrid } from "@/features/restaurant/components/menu-card-grid"
import { MenuCardList } from "@/features/restaurant/components/menu-card-list"
import { RestaurantFormModal } from "@/features/restaurant/components/restaurant-form-modal"
import { getHubById, useRestaurant } from "@/features/restaurant"
import { PaginationControls } from "@/components/pagination-controls"
import { Button } from "@/components/ui/button"
import { AppLoader } from "@/components/ui/app-loader"
import { Input } from "@/components/ui/input"

const MENUS_PER_PAGE = 8

type RestaurantMenuSectionProps = {
  restaurantId: string
}

function RestaurantMenuSectionContent({
  restaurantId,
}: RestaurantMenuSectionProps) {
  const { data: restaurant, isPending } = useRestaurant(restaurantId)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [editRestaurantOpen, setEditRestaurantOpen] = useState(false)

  const catalogHub = restaurant ? getHubById(restaurant.hubId) : undefined
  const menus = useMemo(
    () => catalogHub?.menus ?? restaurant?.menus ?? [],
    [catalogHub, restaurant]
  )
  const hubId = catalogHub?.id ?? restaurant?.hubId ?? restaurantId

  const totalPages = Math.max(1, Math.ceil(menus.length / MENUS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)

  const paginatedMenus = useMemo(
    () => menus.slice((currentPage - 1) * MENUS_PER_PAGE, currentPage * MENUS_PER_PAGE),
    [menus, currentPage]
  )

  if (!isPending && !restaurant) {
    notFound()
  }

  if (!restaurant) {
    return <AppLoader className="flex-1 bg-muted p-12" />
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="border-b border-border/50 bg-background px-4 py-4 md:px-6">
        <div className="mb-4">
          <Link
            href="/kitchen"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <span aria-hidden>←</span>
            All restaurants
          </Link>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl flex-1">
            <Input
              type="search"
              icon={{ name: "search", position: "left" }}
              placeholder="Search menu items"
              className="h-10"
              readOnly
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
              icon={{ name: "edit", position: "left" }}
              onClick={() => setEditRestaurantOpen(true)}
            >
              Edit Restaurant
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            {restaurant.name}
          </h2>
          {view === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedMenus.map((menu) => (
                <MenuCardGrid key={menu.id} menu={menu} hubId={hubId} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {paginatedMenus.map((menu) => (
                <MenuCardList key={menu.id} menu={menu} hubId={hubId} />
              ))}
            </div>
          )}
        </div>

        {menus.length > 0 ? (
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
        restaurant={restaurant}
      />
    </div>
  )
}

export function RestaurantMenuSection({ restaurantId }: RestaurantMenuSectionProps) {
  return (
    <RestaurantMenuSectionContent key={restaurantId} restaurantId={restaurantId} />
  )
}
