"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type {
  ApiSalesDashboardDeleteRequest,
  ApiSalesDashboardOrder,
} from "@/features/offline-order/types"
import { getSalesDashboardOrderReference } from "@/features/offline-order/utils/sales-dashboard-order"

function getOrderLabel(order: ApiSalesDashboardOrder) {
  return getSalesDashboardOrderReference(order)
}

function getDeleteRequestReason(request: ApiSalesDashboardDeleteRequest) {
  return request.reason?.trim() || request.notes?.trim() || "No reason provided"
}

type CreateDeleteRequestColumnsOptions = {
  onApprove: (request: ApiSalesDashboardDeleteRequest) => void
}

export function createDeleteRequestColumns({
  onApprove,
}: CreateDeleteRequestColumnsOptions): ColumnDef<ApiSalesDashboardDeleteRequest>[] {
  return [
    {
      id: "order",
      header: "Order",
      cell: ({ row }) => {
        const order = row.original.order
        const orderId = row.original.order_id
        return (
          <span className="whitespace-nowrap font-medium text-foreground">
            {order ? getOrderLabel(order) : `#${orderId}`}
          </span>
        )
      },
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <span>
          {row.original.order?.customer_name?.trim() || "Walk-in Customer"}
        </span>
      ),
    },
    {
      id: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <span className="max-w-[240px] truncate">
          {getDeleteRequestReason(row.original)}
        </span>
      ),
    },
    {
      id: "requestedBy",
      header: "Requested By",
      cell: ({ row }) => (
        <span>{row.original.requested_by?.name ?? "Unknown"}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.status ?? "pending"}</Badge>
      ),
    },
    {
      id: "actions",
      header: () => <span className="block text-right">Actions</span>,
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            type="button"
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/5"
            onClick={() => onApprove(row.original)}
          >
            Approve Deletion
          </Button>
        </div>
      ),
      enableHiding: false,
    },
  ]
}
