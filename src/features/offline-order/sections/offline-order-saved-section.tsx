"use client"

import Link from "next/link"
import { useCallback, useMemo, useState } from "react"

import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { createSavedOrdersColumns } from "@/features/offline-order/columns/saved-orders-columns"
import { OfflineOrderSavedToolbar } from "@/features/offline-order/components/offline-order-saved-toolbar"
import { useResumeSalesDashboardOrder } from "@/features/offline-order/hooks/use-resume-sales-dashboard-order"
import { useSalesDashboardSavedOrdersSorted } from "@/features/offline-order/hooks/use-sales-dashboard-saved-orders"
import {
  clearAllSavedOrdersWithToast,
  deleteSavedOrderWithToast,
  useClearAllSavedOrders,
  useDeleteSavedOrder,
} from "@/features/offline-order/hooks/use-saved-order-mutations"
import type { OfflineOrderSavedSort } from "@/features/offline-order/types"

export function OfflineOrderSavedSection() {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<OfflineOrderSavedSort>("time_saved")
  const [clearAllOpen, setClearAllOpen] = useState(false)
  const { resumeOrderById, isPending: isResuming } = useResumeSalesDashboardOrder()
  const deleteSavedOrder = useDeleteSavedOrder()
  const clearAllSavedOrders = useClearAllSavedOrders()
  const {
    savedOrders: visibleOrders,
    savedOrderCount,
    isPending,
    isFetching,
    isError,
    error,
  } = useSalesDashboardSavedOrdersSorted({
    search: search.trim() || undefined,
    sort,
  })

  const handleDelete = useCallback(
    async (orderId: string | number) => {
      await deleteSavedOrderWithToast(deleteSavedOrder, orderId)
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
    await clearAllSavedOrdersWithToast(clearAllSavedOrders)
    setClearAllOpen(false)
  }

  const emptyMessage = search
    ? "No saved orders match your search."
    : "No saved orders on hold yet."

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
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

      {savedOrderCount > 0 ? (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-5">
          <div>
            <p className="font-medium text-foreground">
              {savedOrderCount} saved order{savedOrderCount === 1 ? "" : "s"}{" "}
              on hold
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
          <Link href="/offline-order/new">Back to New Order</Link>
        </Button>
      </div>

      <BaseAlertDialog
        title="Clear all saved orders?"
        open={clearAllOpen}
        onOpenChange={setClearAllOpen}
        confirmLabel="Clear All"
        pendingLabel="Clearing..."
        confirmVariant="destructive"
        onConfirm={handleClearAll}
      >
        This will remove every saved order on hold. This action cannot be undone.
      </BaseAlertDialog>
    </div>
  )
}
