"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { SalesTransactionRow } from "@/features/sales-transaction/types"
import { formatSalesTransactionAmount } from "@/features/sales-transaction/utils/format"
import { getSalesTransactionSourceBadgeClass } from "@/features/sales-transaction/utils/source-badge"

export const salesTransactionColumns: ColumnDef<SalesTransactionRow>[] = [
  {
    id: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">
        {row.original.transactionNumber}
      </span>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => <span>{row.original.customerName}</span>,
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
    id: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">
        {formatSalesTransactionAmount(row.original.amount)}
      </span>
    ),
  },
  {
    id: "time",
    header: () => <span className="block text-right">Time</span>,
    cell: ({ row }) => (
      <span className="block text-right text-muted-foreground">
        {row.original.timeLabel}
      </span>
    ),
  },
]
