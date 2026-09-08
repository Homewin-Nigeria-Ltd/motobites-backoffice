"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ApiSalesDashboardOrder } from "@/features/offline-order/types"
import { formatOfflineOrderAmount } from "@/features/offline-order/utils/order-totals"
import {
  getSalesDashboardOrderItemCount,
  getSalesDashboardOrderReference,
  getSalesDashboardOrderStatusLabel,
  getSalesDashboardOrderTotal,
} from "@/features/offline-order/utils/sales-dashboard-order"

type CreateDeleteRequestOrderColumnsOptions = {
  onRequestDeletion: (orderId: string) => void
}

export function createDeleteRequestOrderColumns({
  onRequestDeletion,
}: CreateDeleteRequestOrderColumnsOptions): ColumnDef<ApiSalesDashboardOrder>[] {
  return [
    {
      id: "order",
      header: "Order",
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-medium text-foreground">
          {getSalesDashboardOrderReference(row.original)}
        </span>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <span>
          {row.original.customer_name?.trim() || "Walk-in Customer"}
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
      id: "actions",
      header: () => <span className="block text-right">Actions</span>,
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            type="button"
            variant="outline"
            onClick={() => onRequestDeletion(String(row.original.id))}
          >
            Request Deletion
          </Button>
        </div>
      ),
      enableHiding: false,
    },
  ]
}
