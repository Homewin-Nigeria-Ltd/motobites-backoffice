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
<<<<<<< HEAD
import { useSession } from "@/features/auth/hooks/use-session"
import {
  useRequestOfflineOrderDeletion,
  useSalesDashboardOrders,
} from "@/features/offline-order/hooks/use-offline-order-queries"
import { isSalesRep } from "@/features/offline-order/utils/admin-role"
import { getSalesDashboardOrderReference } from "@/features/offline-order/utils/sales-dashboard-order"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"
=======
import { useSalesDashboardOrders } from "@/features/offline-order/hooks/use-offline-order-queries"
import { useBranchFilter } from "@/context/branch-context"
>>>>>>> e5a94f7 (feat: global branch filter, pos branch origin, order management branch visibility, and husky hook fixes)

const DEFAULT_PAGE_SIZE = 10

export function OfflineOrderAllOrdersSection() {
<<<<<<< HEAD
  const { data: session } = useSession()
  const user = session?.user
  const canRequestDeletion = isSalesRep(user)

=======
  const { branchId } = useBranchFilter()
>>>>>>> e5a94f7 (feat: global branch filter, pos branch origin, order management branch visibility, and husky hook fixes)
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  })
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null)
  const [deleteReason, setDeleteReason] = useState("")

  const { data, isPending, isFetching, isError, error } = useSalesDashboardOrders({
    search: search.trim() || undefined,
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    fulfillment_branch_id: branchId ?? undefined,
  })

  const requestDeletion = useRequestOfflineOrderDeletion()

  const orders = data?.data ?? []
  const totalPages = data?.meta.last_page ?? 1
  const currentPage = data?.meta.current_page ?? pagination.pageIndex + 1

  const selectedOrder = useMemo(
    () => orders.find((order) => String(order.id) === deleteOrderId) ?? null,
    [deleteOrderId, orders],
  )

  const columns = useMemo(
    () =>
      createAllOrdersColumns({
        showDeleteAction: canRequestDeletion,
        onRequestDeletion: (orderId) => {
          setDeleteOrderId(orderId)
          setDeleteReason("")
        },
      }),
    [canRequestDeletion],
  )

  if (isError) {
    throw error
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
    ? "No orders match your search."
    : "No offline orders found yet."

  const selectedOrderLabel = selectedOrder
    ? `#${getSalesDashboardOrderReference(selectedOrder)}`
    : "this order"

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <DataTable
        columns={columns}
        data={orders}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isPending || (isFetching && orders.length === 0)}
        emptyMessage={emptyMessage}
        toolbar={
          <OfflineOrderSearchToolbar
            search={search}
            onSearchChange={handleSearchChange}
            placeholder="Search orders by ID or customer..."
          />
        }
      />

      <div className="mt-4">
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
