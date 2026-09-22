"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import type { PaginationState } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DataTable } from "@/components/data-table"
import { createAllOrdersColumns } from "@/features/offline-order/columns/all-orders-columns"
import { OfflineOrderSearchToolbar } from "@/features/offline-order/components/offline-order-search-toolbar"
import { useBranchFilter } from "@/context/branch-context"
import { useSession } from "@/features/auth/hooks/use-session"
import {
  useRequestOfflineOrderDeletion,
  useSalesDashboardDeletedOrders,
  useSalesDashboardOrders,
} from "@/features/offline-order/hooks/use-offline-order-queries"
import { isSalesManager, isSalesRep } from "@/features/offline-order/utils/admin-role"
import { getSalesDashboardOrderReference } from "@/features/offline-order/utils/sales-dashboard-order"
import { ApiError } from "@/lib/api/client"
import { cn } from "@/lib/utils"
import { toast } from "@/lib/toast"

const DEFAULT_PAGE_SIZE = 10

const ORDER_TABS = [
  { id: "all", label: "All Orders" },
  { id: "deleted", label: "Deleted Orders" },
] as const

type AllOrdersTab = (typeof ORDER_TABS)[number]["id"]

export function OfflineOrderAllOrdersSection() {
  const { branchId } = useBranchFilter()
  const { data: session } = useSession()
  const user = session?.user
  const canRequestDeletion = isSalesRep(user)
  const showReprintCount = isSalesManager(user)
  const [tab, setTab] = useState<AllOrdersTab>("all")
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  })
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null)
  const [deleteReason, setDeleteReason] = useState("")
  const isDeletedTab = tab === "deleted"

  const queryParams = {
    search: search.trim() || undefined,
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    fulfillment_branch_id: branchId ?? undefined,
  }

  const ordersQuery = useSalesDashboardOrders(queryParams, {
    enabled: !isDeletedTab,
  })
  const deletedOrdersQuery = useSalesDashboardDeletedOrders(queryParams, {
    enabled: isDeletedTab,
  })
  const activeQuery = isDeletedTab ? deletedOrdersQuery : ordersQuery

  const requestDeletion = useRequestOfflineOrderDeletion()

  const orders = activeQuery.data?.data ?? []
  const totalPages = activeQuery.data?.meta.last_page ?? 1
  const currentPage = activeQuery.data?.meta.current_page ?? pagination.pageIndex + 1

  const selectedOrder = useMemo(
    () => orders.find((order) => String(order.id) === deleteOrderId) ?? null,
    [deleteOrderId, orders],
  )

  const columns = useMemo(
    () =>
      createAllOrdersColumns({
        showDeleteAction: canRequestDeletion && !isDeletedTab,
        showReprintAction: !isDeletedTab,
        showReprintCount: showReprintCount && !isDeletedTab,
        onRequestDeletion: (orderId) => {
          setDeleteOrderId(orderId)
          setDeleteReason("")
        },
      }),
    [canRequestDeletion, isDeletedTab, showReprintCount],
  )

  if (activeQuery.isError) {
    throw activeQuery.error
  }

  const handleTabChange = (nextTab: AllOrdersTab) => {
    setTab(nextTab)
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((current) => ({
      ...current,
      pageIndex: page - 1,
    }))
  }

  const handleCloseDeleteDialog = () => {
    if (requestDeletion.isPending) {
      return
    }

    setDeleteOrderId(null)
    setDeleteReason("")
  }

  const handleSubmitDeleteRequest = async () => {
    if (!deleteOrderId || deleteReason.trim().length === 0) {
      return
    }

    try {
      await requestDeletion.mutateAsync({
        orderId: deleteOrderId,
        payload: { reason: deleteReason.trim() },
      })
      toast.success("Deletion request submitted for manager review.")
      setDeleteOrderId(null)
      setDeleteReason("")
    } catch (mutationError) {
      const message =
        mutationError instanceof ApiError
          ? mutationError.message
          : "Failed to submit deletion request."

      toast.error(message)
    }
  }

  const emptyMessage = search
    ? isDeletedTab
      ? "No deleted orders match your search."
      : "No orders match your search."
    : isDeletedTab
      ? "No deleted orders found."
      : "No offline orders found yet."

  const selectedOrderLabel = selectedOrder
    ? `#${getSalesDashboardOrderReference(selectedOrder)}`
    : "this order"

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-muted p-4 md:p-6">
      <div
        className="mb-4 flex flex-wrap items-center gap-2"
        role="tablist"
        aria-label="Order lists"
      >
        {ORDER_TABS.map((orderTab) => {
          const isActive = tab === orderTab.id

          return (
            <Button
              key={orderTab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              variant="outline"
              className={cn(
                "h-auto rounded-lg px-4 py-2 text-sm font-medium",
                isActive
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:bg-transparent hover:text-foreground",
              )}
              onClick={() => handleTabChange(orderTab.id)}
            >
              {orderTab.label}
            </Button>
          )
        })}
      </div>

      <DataTable
        columns={columns}
        data={orders}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={
          activeQuery.isPending ||
          (activeQuery.isFetching && orders.length === 0)
        }
        emptyMessage={emptyMessage}
        scrollable
        toolbar={
          <OfflineOrderSearchToolbar
            search={search}
            onSearchChange={handleSearchChange}
            placeholder={
              isDeletedTab
                ? "Search deleted orders by ID or customer..."
                : "Search orders by ID or customer..."
            }
          />
        }
      />

      <div className="mt-4 shrink-0">
        <Button asChild variant="ghost">
          <Link href="/offline-order/new">Back to New Order</Link>
        </Button>
      </div>

      <Dialog
        open={deleteOrderId != null}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseDeleteDialog()
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request order deletion</DialogTitle>
            <DialogDescription>
              Submit a deletion request for {selectedOrderLabel}. A sales manager
              will review and approve it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="all-orders-delete-reason">Deletion reason</Label>
            <Textarea
              id="all-orders-delete-reason"
              value={deleteReason}
              onChange={(event) => setDeleteReason(event.target.value)}
              placeholder="Explain why this offline order should be cancelled..."
              className="min-h-28 resize-none"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={requestDeletion.isPending}
              onClick={handleCloseDeleteDialog}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={
                deleteReason.trim().length === 0 || requestDeletion.isPending
              }
              onClick={handleSubmitDeleteRequest}
            >
              {requestDeletion.isPending ? "Submitting..." : "Submit request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
