"use client"

import Link from "next/link"
import { useCallback, useMemo, useState } from "react"

import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { createSavedOrdersColumns } from "@/features/offline-order/columns/saved-orders-columns"
import { OfflineOrderSavedToolbar } from "@/features/offline-order/components/offline-order-saved-toolbar"
import type { OfflineOrderSavedSort } from "@/features/offline-order/types"
import { sortSalesDashboardOrders } from "@/features/offline-order/utils/sales-dashboard-order"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

import {
  useClearAllSavedBulkOrders,
  useDeleteSavedBulkOrder,
  useSavedBulkOrders,
} from "../hooks/use-bulk-order-queries"
import { useResumeBulkOrder } from "../hooks/use-resume-bulk-order"

export function BulkOrderSavedSection() {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<OfflineOrderSavedSort>("time_saved")
  const [clearAllOpen, setClearAllOpen] = useState(false)
  const { resumeOrderById, isPending: isResuming } = useResumeBulkOrder()
  const deleteSavedOrder = useDeleteSavedBulkOrder()
  const clearAllSavedOrders = useClearAllSavedBulkOrders()
  const {
    savedOrders,
    isPending,
    isFetching,
    isError,
    error,
  } = useSavedBulkOrders({
    search: search.trim() || undefined,
  })

  const visibleOrders = useMemo(
    () => sortSalesDashboardOrders(savedOrders, sort),
    [savedOrders, sort],
  )

  const handleDelete = useCallback(
    async (orderId: string | number) => {
      try {
        await deleteSavedOrder.mutateAsync(orderId)
        toast.success("Saved bulk order deleted.")
      } catch (mutationError) {
        const message =
          mutationError instanceof ApiError
            ? mutationError.message
            : "Failed to delete saved bulk order."

        toast.error(message)
      }
    },
    [deleteSavedOrder],
  )

  const columns = useMemo(
    () =>
      createSavedOrdersColumns({
        onDelete: (orderId) => void handleDelete(orderId),
        onResume: (orderId) => void resumeOrderById(orderId),
        isDeleting: deleteSavedOrder.isPending,
        isResuming,
      }),
    [deleteSavedOrder.isPending, handleDelete, isResuming, resumeOrderById],
  )

  if (isError) {
    throw error
  }

  const handleClearAll = async () => {
    try {
      await clearAllSavedOrders.mutateAsync()
      toast.success("All saved bulk orders cleared.")
      setClearAllOpen(false)
    } catch (mutationError) {
      const message =
        mutationError instanceof ApiError
          ? mutationError.message
          : "Failed to clear saved bulk orders."

      toast.error(message)
    }
  }

  const emptyMessage = search
    ? "No saved bulk orders match your search."
    : "No saved bulk orders on hold yet."

  return (
    <div className="flex flex-col bg-muted p-4 md:p-6">
      <DataTable
        columns={columns}
        data={visibleOrders}
        isLoading={isPending || (isFetching && visibleOrders.length === 0)}
        emptyMessage={emptyMessage}
        toolbar={
          <OfflineOrderSavedToolbar
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
          />
        }
      />

      {visibleOrders.length > 0 ? (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-5">
          <div>
            <p className="font-medium text-foreground">
              {visibleOrders.length} saved bulk order
              {visibleOrders.length === 1 ? "" : "s"} on hold
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Orders kept on hold will be cleared automatically at the end of
              the daily shifts.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5"
            disabled={clearAllSavedOrders.isPending}
            onClick={() => setClearAllOpen(true)}
          >
            Clear All Saved Orders
          </Button>
        </div>
      ) : null}

      <div className="mt-4">
        <Button asChild variant="ghost">
          <Link href="/offline-order/bulk">Back to Bulk Order</Link>
        </Button>
      </div>

      <BaseAlertDialog
        title="Clear all saved bulk orders?"
        open={clearAllOpen}
        onOpenChange={setClearAllOpen}
        confirmLabel="Clear All"
        pendingLabel="Clearing..."
        confirmVariant="destructive"
        onConfirm={handleClearAll}
      >
        This will remove every saved bulk order on hold. This action cannot be
        undone.
      </BaseAlertDialog>
    </div>
  )
}
