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
import { createDeleteRequestColumns } from "@/features/offline-order/columns/delete-request-columns"
import { OfflineOrderManagerModeBanner } from "@/features/offline-order/components/offline-order-manager-mode-banner"
import { OfflineOrderSearchToolbar } from "@/features/offline-order/components/offline-order-search-toolbar"
import {
  useApproveOfflineOrderDeletion,
  useSalesDashboardDeleteRequests,
} from "@/features/offline-order/hooks/use-offline-order-queries"
import type { ApiSalesDashboardDeleteRequest } from "@/features/offline-order/types"
import { getSalesDashboardOrderReference } from "@/features/offline-order/utils/sales-dashboard-order"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

const DEFAULT_PAGE_SIZE = 10

function getDeleteRequestReason(request: ApiSalesDashboardDeleteRequest) {
  return request.reason?.trim() || request.notes?.trim() || ""
}

export function OfflineOrderDeleteRequestSection() {
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  })
  const [approveTarget, setApproveTarget] =
    useState<ApiSalesDashboardDeleteRequest | null>(null)
  const [approveReason, setApproveReason] = useState("")

  const queryParams = {
    search: search.trim() || undefined,
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
  }

  const deleteRequestsQuery = useSalesDashboardDeleteRequests(queryParams)
  const approveDeletion = useApproveOfflineOrderDeletion()

  const deleteRequests = deleteRequestsQuery.data?.data ?? []
  const totalPages = deleteRequestsQuery.data?.meta.last_page ?? 1
  const currentPage =
    deleteRequestsQuery.data?.meta.current_page ?? pagination.pageIndex + 1

  const deleteRequestColumns = useMemo(
    () =>
      createDeleteRequestColumns({
        onApprove: (request) => {
          setApproveTarget(request)
          setApproveReason(getDeleteRequestReason(request))
        },
      }),
    [],
  )

  if (deleteRequestsQuery.isError) {
    throw deleteRequestsQuery.error
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

  const handleCloseApproveDialog = () => {
    if (approveDeletion.isPending) {
      return
    }

    setApproveTarget(null)
    setApproveReason("")
  }

  const handleApproveDeletion = async () => {
    if (!approveTarget || approveReason.trim().length === 0) {
      return
    }

    try {
      await approveDeletion.mutateAsync({
        orderId: approveTarget.order_id,
        payload: { reason: approveReason.trim() },
      })
      toast.success("Offline order cancelled successfully.")
      setApproveTarget(null)
      setApproveReason("")
    } catch (mutationError) {
      const message =
        mutationError instanceof ApiError
          ? mutationError.message
          : "Failed to approve order deletion."

      toast.error(message)
    }
  }

  const isLoading =
    deleteRequestsQuery.isPending ||
    (deleteRequestsQuery.isFetching && deleteRequests.length === 0)

  const selectedOrderLabel = approveTarget?.order
    ? `#${getSalesDashboardOrderReference(approveTarget.order)}`
    : approveTarget
      ? `#${approveTarget.order_id}`
      : "this order"

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <OfflineOrderManagerModeBanner />

      <div className="flex min-h-0 flex-1 flex-col gap-6 p-4 md:p-6">
        <DataTable
          columns={deleteRequestColumns}
          data={deleteRequests}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          emptyMessage="No pending deletion requests."
          toolbar={
            <OfflineOrderSearchToolbar
              search={search}
              onSearchChange={handleSearchChange}
              placeholder="Search deletion requests..."
            />
          }
        />

        <Button asChild variant="ghost" className="w-fit">
          <Link href="/offline-order/all">Back to All Orders</Link>
        </Button>
      </div>

      <Dialog
        open={approveTarget != null}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseApproveDialog()
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve order deletion?</DialogTitle>
            <DialogDescription>
              This will permanently cancel {selectedOrderLabel}. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="approve-deletion-reason">Approval reason</Label>
            <Textarea
              id="approve-deletion-reason"
              value={approveReason}
              onChange={(event) => setApproveReason(event.target.value)}
              placeholder="Confirm or update the reason for cancelling this order..."
              className="min-h-28 resize-none"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={approveDeletion.isPending}
              onClick={handleCloseApproveDialog}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={
                approveReason.trim().length === 0 || approveDeletion.isPending
              }
              onClick={handleApproveDeletion}
            >
              {approveDeletion.isPending ? "Approving..." : "Approve deletion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
