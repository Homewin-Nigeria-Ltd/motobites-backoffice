"use client"

import { useSearchParams } from "next/navigation"
import { PageHeader } from "@/components/layouts/dashboard"
import { AddMenuSheet } from "@/features/restaurant/components/add-menu-sheet"
import { FeedbackSummaryCards } from "@/features/restaurant/components/feedback-summary-cards"
import { MenuItemsTable } from "@/features/restaurant/components/menu-items-table"
import {
  complimentTags,
  getHubNameById,
  getMenuById,
  getMenuNameById,
  improvementTags,
  menuDetailItems,
} from "@/features/restaurant"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type MenuDetailSectionProps = {
  menuId: string
}

export function MenuDetailSection({ menuId }: MenuDetailSectionProps) {
  const searchParams = useSearchParams()
  const hubId = searchParams.get("hub") ?? getMenuById(menuId)?.hub.id
  const hubName = hubId ? getHubNameById(hubId) : undefined
  const activeItemName =
    getMenuNameById(menuId) ??
    menuDetailItems.find((item) => item.id === menuId)?.name

  const items = hubName
    ? menuDetailItems.filter((item) => item.hub === hubName)
    : menuDetailItems

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <PageHeader
        title="Restaurant Management"
        description="Allow restaurants to update their virtual menus, add new items, or mark certain items as unavailable."
        breadcrumbs={[
          { label: "Overview", href: "/dashboard" },
          { label: "Catalog", href: "/menu" },
          { label: "Performance" },
        ]}
      />

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
                placeholder="Search for Menus and combos"
                className="h-10"
                readOnly
              />
            </div>
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

      <div className="flex-1 space-y-6 px-4 py-6 md:px-6">
        <FeedbackSummaryCards
          compliments={complimentTags}
          improvements={improvementTags}
        />
        <MenuItemsTable
          items={items}
          activeItemId={menuId}
          activeItemName={activeItemName}
        />
      </div>
    </div>
  )
}
