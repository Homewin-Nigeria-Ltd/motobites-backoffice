"use client"

import { useState } from "react"

import { AddMenuSheet } from "@/features/restaurant/components/add-menu-sheet"
import { CatalogHubSection } from "@/features/restaurant/components/catalog-hub-section"
import { useMenuHubs } from "@/features/restaurant"
import { PaginationControls } from "@/components/pagination-controls"
import { AppLoader } from "@/components/ui/app-loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function MenuCatalogSection() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const { data: hubs = [], isPending } = useMenuHubs()

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="border-b border-border/50 bg-background px-4 py-4 md:px-6">
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
                placeholder="Search for Menus and comobs"
                className="h-10"
                readOnly
              />
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
            <AddMenuSheet
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
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-6 md:px-6">
          {isPending ? (
            <AppLoader />
          ) : (
            hubs.map((hub) => (
              <CatalogHubSection key={hub.id} hub={hub} view={view} />
            ))
          )}
        </div>

        <div className="flex shrink-0 justify-center border-t border-border/60 bg-background px-4 py-4 md:px-6">
          <PaginationControls page={1} totalPages={6} />
        </div>
      </div>
    </div>
  )
}
