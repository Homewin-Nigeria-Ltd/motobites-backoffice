"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icons"
import type { ApiSalesDashboardOrder } from "@/features/offline-order/types"
import { formatOfflineOrderAmount } from "@/features/offline-order/utils/order-totals"
import {
  getSalesDashboardOrderAssignedTo,
  getSalesDashboardOrderDateLabel,
  getSalesDashboardOrderItemCount,
  getSalesDashboardOrderReference,
  getSalesDashboardOrderStatusLabel,
  getSalesDashboardOrderTimeLabel,
  getSalesDashboardOrderTotal,
} from "@/features/offline-order/utils/sales-dashboard-order"

type CreateAllOrdersColumnsOptions = {
  showDeleteAction?: boolean
  onRequestDeletion?: (orderId: string) => void
}

export function createAllOrdersColumns({
  showDeleteAction = false,
  onRequestDeletion,
}: CreateAllOrdersColumnsOptions = {}): ColumnDef<ApiSalesDashboardOrder>[] {
  const columns: ColumnDef<ApiSalesDashboardOrder>[] = [
    {
      id: "orderId",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-medium text-foreground">
          #{getSalesDashboardOrderReference(row.original)}
        </span>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <span className="max-w-[160px] truncate">
          {row.original.customer_name?.trim() || "Walk-in Customer"}
        </span>
      ),
    },
    {
      id: "kitchen",
      header: "Kitchen",
      cell: ({ row }) => (
        <span className="max-w-[140px] truncate">
          {row.original.kitchen?.name ?? "—"}
        </span>
      ),
    },
    {
      id: "items",
      header: "Items",
      cell: ({ row }) => {
        const itemCount = getSalesDashboardOrderItemCount(row.original)
        return (
          <span>
            {itemCount} item{itemCount === 1 ? "" : "s"}
          </span>
        )
      },
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">
          {formatOfflineOrderAmount(getSalesDashboardOrderTotal(row.original))}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline">
          {getSalesDashboardOrderStatusLabel(row.original)}
        </Badge>
      ),
    },
    {
      id: "assignedTo",
      header: "Assigned To",
      cell: ({ row }) => (
        <span className="max-w-[140px] truncate">
          {getSalesDashboardOrderAssignedTo(row.original)}
        </span>
      ),
    },
    {
      id: "orderDate",
      header: () => <span className="block text-right">Order Date</span>,
      cell: ({ row }) => {
        const order = row.original
        const dateLabel = getSalesDashboardOrderDateLabel(order)
        const timeAgo = order.time_ago?.trim()
        const primaryLabel =
          dateLabel ?? timeAgo ?? getSalesDashboardOrderTimeLabel(order)

        return (
          <div className="block text-right">
            <span className="text-foreground">{primaryLabel}</span>
            {dateLabel && timeAgo ? (
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {timeAgo}
              </span>
            ) : null}
          </div>
        )
      },
    },
  ]

  if (showDeleteAction && onRequestDeletion) {
    columns.push({
      id: "actions",
      header: () => <span className="block text-right">Actions</span>,
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 text-destructive hover:text-destructive"
            onClick={() => onRequestDeletion(String(row.original.id))}
          >
            <Icon name="trash" className="size-4" />
            Delete
          </Button>
        </div>
      ),
      enableHiding: false,
    })
  }

  return columns
}
