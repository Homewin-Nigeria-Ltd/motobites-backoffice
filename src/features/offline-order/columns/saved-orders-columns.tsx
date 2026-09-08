"use client"

import type { ColumnDef } from "@tanstack/react-table"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import type { ApiSalesDashboardOrder } from "@/features/offline-order/types"
import { formatOfflineOrderAmount } from "@/features/offline-order/utils/order-totals"
import {
  getSalesDashboardOrderAssignedTo,
  getSalesDashboardOrderItemCount,
  getSalesDashboardOrderReference,
  getSalesDashboardOrderTimeLabel,
  getSalesDashboardOrderTotal,
} from "@/features/offline-order/utils/sales-dashboard-order"
import { getUserInitials } from "@/utils/get-initials"

type CreateSavedOrdersColumnsOptions = {
  onDelete: (orderId: string | number) => void
  onResume: (orderId: string | number) => void
  isDeleting?: boolean
  isResuming?: boolean
}

export function createSavedOrdersColumns({
  onDelete,
  onResume,
  isDeleting = false,
  isResuming = false,
}: CreateSavedOrdersColumnsOptions): ColumnDef<ApiSalesDashboardOrder>[] {
  return [
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
      id: "items",
      header: "Items",
      cell: ({ row }) => {
        const itemCount = getSalesDashboardOrderItemCount(row.original)
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            {itemCount} Item{itemCount === 1 ? "" : "s"}
          </Badge>
        )
      },
    },
    {
      id: "total",
      header: "Total Amount",
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">
          {formatOfflineOrderAmount(getSalesDashboardOrderTotal(row.original))}
        </span>
      ),
    },
    {
      id: "timeSaved",
      header: "Time Saved",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Icons.clock size={14} />
          <span>{getSalesDashboardOrderTimeLabel(row.original)}</span>
        </div>
      ),
    },
    {
      id: "assignedTo",
      header: "Assigned To",
      cell: ({ row }) => {
        const assignedTo = getSalesDashboardOrderAssignedTo(row.original)
        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              <AvatarFallback className="text-xs">
                {getUserInitials(assignedTo)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{assignedTo}</span>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: () => <span className="block text-right">Actions</span>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="border-destructive/30 text-destructive hover:bg-destructive/5"
            disabled={isDeleting || isResuming}
            onClick={() => onDelete(row.original.id)}
            aria-label={`Delete saved order ${getSalesDashboardOrderReference(row.original)}`}
          >
            <Icons.trash size={16} />
          </Button>
          <Button
            type="button"
            size="sm"
            className="px-4"
            disabled={isResuming}
            onClick={() => onResume(row.original.id)}
          >
            Resume Order
          </Button>
        </div>
      ),
      enableHiding: false,
    },
  ]
}
