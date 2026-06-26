"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { AddInventoryItemSheet } from "@/features/inventory/components/add-inventory-item-sheet"
import { EditInventoryItemSheet } from "@/features/inventory/components/edit-inventory-item-sheet"
import { InventoryRecentStockCard } from "@/features/inventory/components/inventory-recent-stock-card"
import { InventoryStockLevelChart } from "@/features/inventory/components/inventory-stock-level-chart"
import { InventoryTableToolbar } from "@/features/inventory/components/inventory-table-toolbar"
import { InventoryToolbar } from "@/features/inventory/components/inventory-toolbar"
import { ViewInventoryItemModal } from "@/features/inventory/components/view-inventory-item-modal"
import { createInventoryColumns } from "@/features/inventory/columns"
import { INVENTORY_TABLE_PAGE_SIZE } from "@/features/inventory/constants"
import {
  useInventoryItems,
  useInventoryOverview,
} from "@/features/inventory/hooks/use-inventory-queries"
import type { ApiInventoryItem } from "@/features/inventory/types"
import { exportInventoryItemsCsv } from "@/features/inventory/utils/export-items-csv"
import { DataTable } from "@/components/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { Card, CardContent } from "@/components/ui/card"

const SEARCH_DEBOUNCE_MS = 300

export function InventorySection() {
  const [tableSearch, setTableSearch] = useState("")
  const [debouncedTableSearch, setDebouncedTableSearch] = useState("")
  const [category, setCategory] = useState("")
  const [stockLevel, setStockLevel] = useState("")
  const [tablePage, setTablePage] = useState(1)
  const [addSheetOpen, setAddSheetOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ApiInventoryItem | null>(null)
  const [viewItem, setViewItem] = useState<ApiInventoryItem | null>(null)
  const [viewOpen, setViewOpen] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedTableSearch(tableSearch)
      setTablePage(1)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [tableSearch])

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value)
    setTablePage(1)
  }, [])

  const handleStockLevelChange = useCallback((value: string) => {
    setStockLevel(value)
    setTablePage(1)
  }, [])

  const {
    data: overviewResponse,
    isPending: isOverviewPending,
    isError: isOverviewError,
    error: overviewError,
  } = useInventoryOverview()

  const {
    data: itemsResponse,
    isPending: isItemsPending,
    isFetching: isItemsFetching,
  } = useInventoryItems({
    page: tablePage,
    per_page: INVENTORY_TABLE_PAGE_SIZE,
    search: debouncedTableSearch || undefined,
    category: category || undefined,
    stock_level: stockLevel || undefined,
  })

  const overview = overviewResponse?.data
  const items = itemsResponse?.data ?? []
  const totalPages = itemsResponse?.meta.last_page ?? 1
  const currentPage = itemsResponse?.meta.current_page ?? tablePage
  const recentItems = overview?.recent ?? []

  const handleViewItem = useCallback((item: ApiInventoryItem) => {
    setViewItem(item)
    setViewOpen(true)
  }, [])

  const handleEditItem = useCallback((item: ApiInventoryItem) => {
    setEditingItem(item)
    setEditSheetOpen(true)
  }, [])

  const handleAddItem = useCallback(() => {
    setAddSheetOpen(true)
  }, [])

  const columns = useMemo(
    () =>
      createInventoryColumns({
        onEditItem: handleEditItem,
        page: currentPage,
        perPage: INVENTORY_TABLE_PAGE_SIZE,
      }),
    [currentPage, handleEditItem]
  )

  if (isOverviewPending && !overview) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isOverviewError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {overviewError instanceof Error
            ? overviewError.message
            : "Failed to load inventory overview."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="space-y-4">
        <InventoryToolbar onAddItem={handleAddItem} />

        <div className="grid min-w-0 gap-4 xl:grid-cols-[3fr_2fr]">
          <InventoryStockLevelChart
            stockSummary={
              overview?.stock_summary ?? {
                total_active: 0,
                high: { count: 0, percent: 0 },
                medium: { count: 0, percent: 0 },
                low: { count: 0, percent: 0 },
              }
            }
          />
          <InventoryRecentStockCard
            items={recentItems}
            onViewItem={handleViewItem}
          />
        </div>

        <Card className="gap-0 overflow-hidden py-0">
          <CardContent className="space-y-4 px-4 py-5 sm:px-5">
            <InventoryTableToolbar
              search={tableSearch}
              category={category}
              stockLevel={stockLevel}
              onSearchChange={setTableSearch}
              onCategoryChange={handleCategoryChange}
              onStockLevelChange={handleStockLevelChange}
              onExportCsv={() => exportInventoryItemsCsv(items)}
              isExportDisabled={items.length === 0}
            />

            <DataTable
              columns={columns}
              data={items}
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setTablePage}
              onRowClick={handleViewItem}
              isLoading={isItemsPending || isItemsFetching}
              emptyMessage="No inventory items found."
              className="border-0"
            />
          </CardContent>
        </Card>
      </div>

      <ViewInventoryItemModal
        item={viewItem}
        open={viewOpen}
        onOpenChange={(open) => {
          setViewOpen(open)
          if (!open) {
            setViewItem(null)
          }
        }}
        onEditItem={handleEditItem}
      />

      <AddInventoryItemSheet
        open={addSheetOpen}
        onOpenChange={setAddSheetOpen}
      />

      <EditInventoryItemSheet
        item={editingItem}
        open={editSheetOpen}
        onOpenChange={(open) => {
          setEditSheetOpen(open)
          if (!open) {
            setEditingItem(null)
          }
        }}
      />
    </div>
  )
}
