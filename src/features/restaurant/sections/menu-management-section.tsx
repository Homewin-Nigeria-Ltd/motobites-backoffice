"use client"

import { useMemo, useState } from "react"
import { useDebouncedSearch } from "@/features/restaurant/hooks/use-debounced-search"

import { AddMenuSheet } from "@/features/restaurant/components/add-menu-sheet"
import { MenuKitchenGroup } from "@/features/restaurant/components/menu-kitchen-group"
import { useMenuGroupedItems } from "@/features/restaurant/hooks/use-restaurant-queries"
import type { ApiMenuGroupedItem } from "@/features/restaurant/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { AppLoader } from "@/components/ui/app-loader"

type ViewMode = "grid" | "list"

const emptyGroups: ApiMenuGroupedItem[] = []

export function MenuManagementSection() {
  const [view, setView] = useState<ViewMode>("grid")
  const { value: search, setValue: setSearch, debouncedValue } = useDebouncedSearch("")
  const sortOptions = [
    { label: "Latest", value: "latest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Name", value: "name" },
  ] as const

  type SortValue = (typeof sortOptions)[number]["value"]

  const [sort, setSort] = useState<SortValue>("latest")
  const [menuSheetOpen, setMenuSheetOpen] = useState(false)
  const [editingMenuItemId, setEditingMenuItemId] = useState<string>()

  const { data, isPending, isError, error } = useMenuGroupedItems({
    sort,
    search: debouncedValue?.trim() || undefined,
  })

  const groups = data ?? emptyGroups
  const currentSortLabel = sortOptions.find((o) => o.value === sort)?.label ?? sort

  const filteredGroups: ApiMenuGroupedItem[] = useMemo(() => {
    // Server now handles search and sorting. Just return groups as-is.
    return groups
  }, [groups])

  const totalItems = filteredGroups.reduce((sum, g) => sum + g.items.length, 0)

  if (isError) {
    throw error
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="border-b border-border/50 bg-background px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <Badge variant="secondary" className="h-auto px-4 py-1.5 text-sm font-medium">
              Menu Management
            </Badge>
            <div className="max-w-2xl flex-1">
              <div className="flex items-center gap-2">
                  <Input
                  type="search"
                  icon={{ name: "search", position: "left" }}
                  placeholder="Search menu items"
                  className="h-10 flex-1"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 px-3 text-sm text-muted-foreground flex items-center">
                      Sort: <span className="ml-2 font-medium text-foreground">{currentSortLabel}</span>
                      <Icons.chevronDown size={16} className="ml-2 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {sortOptions.map((opt) => (
                      <DropdownMenuItem
                        key={opt.value}
                        onSelect={() => setSort(opt.value)}
                      >
                        {opt.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
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
              className="h-10 px-4"
              icon={{ name: "add", position: "left" }}
              onClick={() => {
                setEditingMenuItemId(undefined)
                setMenuSheetOpen(true)
              }}
            >
              Add New Item
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-6 md:px-6">
          {isPending ? (
            <AppLoader />
          ) : totalItems === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-border bg-background p-12 text-center">
              <p className="text-sm text-muted-foreground">
                {search ? `No menu items found for "${search}".` : "No menu items found."}
              </p>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <MenuKitchenGroup
                key={group.kitchen.id}
                group={group}
                itemCount={group.items.length}
                view={view}
                onEditItem={(menuId) => {
                  setEditingMenuItemId(menuId)
                  setMenuSheetOpen(true)
                }}
              />
            ))
          )}
        </div>
      </div>

      <AddMenuSheet
        open={menuSheetOpen}
        onOpenChange={(open) => {
          setMenuSheetOpen(open)
          if (!open) {
            setEditingMenuItemId(undefined)
          }
        }}
        menuItemId={editingMenuItemId}
      />
    </div>
  )
}
