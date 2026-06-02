"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { RestaurantCard } from "@/features/restaurant/components/restaurant-card"
import { RestaurantFormModal } from "@/features/restaurant/components/restaurant-form-modal"
import { useRestaurants } from "@/features/restaurant"
import { PaginationControls } from "@/components/pagination-controls"
import { Button } from "@/components/ui/button"
import { AppLoader } from "@/components/ui/app-loader"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const RESTAURANTS_PER_PAGE = 8

export function RestaurantsSection() {
  const [addOpen, setAddOpen] = useState(false)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const { data: restaurants = [], isPending } = useRestaurants()

  const totalPages = Math.max(1, Math.ceil(restaurants.length / RESTAURANTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)

  const paginatedRestaurants = useMemo(
    () =>
      restaurants.slice(
        (currentPage - 1) * RESTAURANTS_PER_PAGE,
        currentPage * RESTAURANTS_PER_PAGE
      ),
    [currentPage, restaurants]
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="border-b border-border/50 bg-background px-4 py-4 md:px-6">
        <div className="mb-4">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <span aria-hidden>←</span>
            Menu catalog
          </Link>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl flex-1">
            <Input
              type="search"
              icon={{ name: "search", position: "left" }}
              placeholder="Search Restaurant"
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
              icon={{ name: "add", position: "left" }}
              onClick={() => setAddOpen(true)}
            >
              Add New Restaurant
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-6">
          {isPending ? (
            <AppLoader />
          ) : (
            <div
              className={cn(
                view === "grid"
                  ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "flex flex-col gap-6"
              )}
            >
              {paginatedRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>

        {!isPending && restaurants.length > 0 ? (
          <div className="flex shrink-0 justify-center border-t border-border/60 bg-background px-4 py-4 md:px-6">
            <PaginationControls
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </div>

      <RestaurantFormModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
