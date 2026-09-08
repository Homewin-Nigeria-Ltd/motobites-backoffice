"use client"

import type { ColumnDef } from "@tanstack/react-table"

import type { OfflineOrderOverviewTransactionRow } from "@/features/offline-order/types"
import { formatOverviewCurrency } from "@/features/offline-order/utils/build-overview-view-model"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function getSourceBadgeClass(source: string) {
  const normalized = source.toLowerCase()

  if (normalized.includes("whatsapp")) {
    return "bg-emerald-100 text-emerald-700"
  }

  if (normalized.includes("glovo")) {
    return "bg-amber-100 text-amber-700"
  }

  if (normalized.includes("chowdeck")) {
    return "bg-rose-100 text-rose-700"
  }

  if (normalized.includes("web")) {
    return "bg-sky-100 text-sky-700"
  }

  return "bg-primary/10 text-primary"
}

export const overviewTransactionsColumns: ColumnDef<OfflineOrderOverviewTransactionRow>[] =
  [
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
            getSourceBadgeClass(row.original.source),
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
          {formatOverviewCurrency(row.original.amount)}
        </span>
      ),
    },
    {
      id: "paymentMethod",
      header: "Payment Method",
      cell: ({ row }) => <span>{row.original.paymentMethod}</span>,
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
