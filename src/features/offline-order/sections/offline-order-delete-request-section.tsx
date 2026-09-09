"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import type { PaginationState } from "@tanstack/react-table"

import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createDeleteRequestColumns } from "@/features/offline-order/columns/delete-request-columns"
import { createDeleteRequestOrderColumns } from "@/features/offline-order/columns/delete-request-order-columns"
import { OfflineOrderManagerModeBanner } from "@/features/offline-order/components/offline-order-manager-mode-banner"
import { OfflineOrderSearchToolbar } from "@/features/offline-order/components/offline-order-search-toolbar"
import { useSession } from "@/features/auth/hooks/use-session"
import {
  useApproveOfflineOrderDeletion,
  useRequestOfflineOrderDeletion,
  useSalesDashboardDeleteRequests,
  useSalesDashboardOrders,
} from "@/features/offline-order/hooks/use-offline-order-queries"
import type { ApiSalesDashboardOrder } from "@/features/offline-order/types"
import { isSalesManager } from "@/features/offline-order/utils/admin-role"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

const DEFAULT_PAGE_SIZE = 10

export function OfflineOrderDeleteRequestSection() {
  const { data: session } = useSession()
  const user = session?.user
  const isManager = isSalesManager(user)

  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  })
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [reason, setReason] = useState("")
  const [approveOrderId, setApproveOrderId] = useState<string | null>(null)

  const queryParams = {
    search: search.trim() || undefined,
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
  }

  const ordersQuery = useSalesDashboardOrders(queryParams, {
    enabled: !isManager,
  })
  const deleteRequestsQuery = useSalesDashboardDeleteRequests(queryParams, {
    enabled: isManager,
  })

  const requestDeletion = useRequestOfflineOrderDeletion()
  const approveDeletion = useApproveOfflineOrderDeletion()

  const orders = useMemo(
    () => ordersQuery.data?.data ?? [],
    [ordersQuery.data?.data],
  )
  const deleteRequests = deleteRequestsQuery.data?.data ?? []
  const activeQuery = isManager ? deleteRequestsQuery : ordersQuery
  const totalPages = activeQuery.data?.meta.last_page ?? 1
  const currentPage = activeQuery.data?.meta.current_page ?? pagination.pageIndex + 1

  const selectedOrder = useMemo(
    () => orders.find((order) => String(order.id) === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  )

  const deleteRequestColumns = useMemo(
    () =>
      createDeleteRequestColumns({
        onApprove: (orderId) => setApproveOrderId(orderId),
      }),
    [],
  )

  const deleteRequestOrderColumns = useMemo(
    () =>
      createDeleteRequestOrderColumns({
        onRequestDeletion: (orderId) => {
          setSelectedOrderId(orderId)
          setReason("")
        },
      }),
    [],
  )

  if (activeQuery.isError) {
    throw activeQuery.error
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

  const handleRequestDeletion = async () => {
    if (!selectedOrderId || reason.trim().length === 0) {
      return
    }

    try {
      await requestDeletion.mutateAsync({
        orderId: selectedOrderId,
        payload: { reason: reason.trim() },
      })
      toast.success("Deletion request submitted for manager review.")
      setSelectedOrderId(null)
      setReason("")
    } catch (mutationError) {
      const message =
        mutationError instanceof ApiError
          ? mutationError.message
          : "Failed to submit deletion request."

      toast.error(message)
    }
  }

  const handleApproveDeletion = async () => {
    if (!approveOrderId) {
      return
    }

    try {
      await approveDeletion.mutateAsync(approveOrderId)
      toast.success("Offline order cancelled successfully.")
      setApproveOrderId(null)
    } catch (mutationError) {
      const message =
        mutationError instanceof ApiError
          ? mutationError.message
          : "Failed to approve order deletion."

      toast.error(message)
    }
  }

  const searchPlaceholder = isManager
    ? "Search deletion requests..."
    : "Search offline orders by ID or customer..."

  const emptyMessage = isManager
    ? "No pending deletion requests."
    : "No offline orders found."

  const isLoading =
    activeQuery.isPending ||
    (activeQuery.isFetching &&
      (isManager ? deleteRequests.length === 0 : orders.length === 0))

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      {isManager ? <OfflineOrderManagerModeBanner /> : null}

      <div className="flex min-h-0 flex-1 flex-col gap-6 p-4 md:p-6">
        {isManager ? (
          <DataTable
            columns={deleteRequestColumns}
            data={deleteRequests}
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            emptyMessage={emptyMessage}
            toolbar={
              <OfflineOrderSearchToolbar
                search={search}
                onSearchChange={handleSearchChange}
                placeholder={searchPlaceholder}
              />
            }
          />
        ) : (
          <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <DataTable
              columns={deleteRequestOrderColumns}
              data={orders}
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
              emptyMessage={emptyMessage}
              toolbar={
                <OfflineOrderSearchToolbar
                  search={search}
                  onSearchChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                />
              }
            />

            <div className="rounded-2xl border border-border bg-background p-5 lg:sticky lg:top-6 lg:self-start">
              {selectedOrder ? (
                <DeleteRequestForm
                  order={selectedOrder}
                  reason={reason}
                  onReasonChange={setReason}
                  onSubmit={handleRequestDeletion}
                  onCancel={() => {
                    setSelectedOrderId(null)
                    setReason("")
                  }}
                  isPending={requestDeletion.isPending}
                />
              ) : (
                <div className="space-y-2 py-8 text-center">
                  <p className="font-medium text-foreground">
                    Select an order to request deletion
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sales managers will review and approve your request.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <Button asChild variant="ghost" className="w-fit">
          <Link href="/offline-order/new">Back to New Order</Link>
        </Button>
      </div>

      <BaseAlertDialog
        title="Approve order deletion?"
        open={approveOrderId != null}
        onOpenChange={(open) => {
          if (!open) {
            setApproveOrderId(null)
          }
        }}
        confirmLabel="Approve Deletion"
        pendingLabel="Approving..."
        confirmVariant="destructive"
        onConfirm={handleApproveDeletion}
      >
        This will cancel the offline order permanently. This action cannot be
        undone.
      </BaseAlertDialog>
    </div>
  )
}

function DeleteRequestForm({
  order,
  reason,
  onReasonChange,
  onSubmit,
  onCancel,
  isPending,
}: {
  order: ApiSalesDashboardOrder
  reason: string
  onReasonChange: (value: string) => void
  onSubmit: () => void
  onCancel: () => void
  isPending: boolean
}) {
  const orderLabel =
    order.reference_number ?? order.order_number ?? String(order.id)

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Selected order</p>
        <p className="text-lg font-semibold">{orderLabel}</p>
        <p className="text-sm text-muted-foreground">
          {order.customer_name?.trim() || "Walk-in Customer"}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="offline-order-delete-reason">Deletion Reason</Label>
        <Textarea
          id="offline-order-delete-reason"
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          placeholder="Explain why this offline order should be cancelled..."
          className="min-h-28 resize-none"
        />
      </div>

      <Button
        className="h-11 w-full"
        disabled={reason.trim().length === 0 || isPending}
        onClick={onSubmit}
      >
        Submit Delete Request
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="h-11 w-full"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  )
}
