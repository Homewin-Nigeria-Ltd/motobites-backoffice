"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { SalesTransactionHistoryRow } from "@/features/sales-transaction/types"
import { formatSalesTransactionAmount } from "@/features/sales-transaction/utils/format"
import { getSalesTransactionSourceBadgeClass } from "@/features/sales-transaction/utils/source-badge"
import { getSalesTransactionStatusBadgeClass } from "@/features/sales-transaction/utils/status-badge"

export const salesTransactionHistoryColumns: ColumnDef<SalesTransactionHistoryRow>[] =
  [
    {
      id: "transactionId",
      header: "Transaction ID",
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-medium text-foreground">
          {row.original.transactionNumber}
        </span>
      ),
    },
    {
      id: "dateTime",
      header: "Date & Time",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {row.original.dateTimeLabel}
        </span>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <span className="max-w-[140px] truncate">
          {row.original.customerName}
        </span>
      ),
    },
    {
      id: "source",
      header: "Source",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "border-0 px-2.5 py-0.5 text-[11px] font-medium",
            getSalesTransactionSourceBadgeClass(row.original.source),
          )}
        >
          {row.original.sourceLabel}
        </Badge>
      ),
    },
    {
      id: "itemsOrdered",
      header: "Items Ordered",
      cell: ({ row }) => (
        <span className="block max-w-[180px] truncate text-muted-foreground">
          {row.original.itemsOrdered}
        </span>
      ),
    },
    {
      id: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">
          {formatSalesTransactionAmount(row.original.amount)}
        </span>
      ),
    },
    {
      id: "method",
      header: "Method",
      cell: ({ row }) => <span>{row.original.paymentMethod}</span>,
    },
    {
      id: "staff",
      header: "Staff",
      cell: ({ row }) => (
        <span className="max-w-[100px] truncate">{row.original.staff}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "border-0 px-2.5 py-0.5 text-[11px] font-medium",
            getSalesTransactionStatusBadgeClass(row.original.status),
          )}
        >
          {row.original.statusLabel}
        </Badge>
      ),
    },
  ]
