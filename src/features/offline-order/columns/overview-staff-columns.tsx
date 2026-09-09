"use client"

import type { ColumnDef } from "@tanstack/react-table"

import type { OfflineOrderOverviewStaffRow } from "@/features/offline-order/types"
import { formatOverviewCurrency } from "@/features/offline-order/utils/build-overview-view-model"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export const overviewStaffColumns: ColumnDef<OfflineOrderOverviewStaffRow>[] = [
  {
    id: "rank",
    header: "Rank",
    cell: ({ row }) => (
      <span className="inline-flex size-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
        {row.original.rank}
      </span>
    ),
  },
  {
    id: "name",
    header: "Staff Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          {row.original.avatar ? (
            <AvatarImage src={row.original.avatar} alt={row.original.name} />
          ) : null}
          <AvatarFallback className="text-xs">
            {getInitials(row.original.name)}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    id: "orders",
    header: "Orders",
    cell: ({ row }) => <span>{row.original.ordersLabel}</span>,
  },
  {
    id: "revenue",
    header: "Revenue",
    cell: ({ row }) => (
      <span>{formatOverviewCurrency(row.original.revenue)}</span>
    ),
  },
  {
    id: "averageValue",
    header: "Avg Value",
    cell: ({ row }) => (
      <span>{formatOverviewCurrency(row.original.averageValue)}</span>
    ),
  },
  {
    id: "status",
    header: () => <span className="block text-right">Status</span>,
    cell: ({ row }) => (
      <div className="text-right">
        <Badge
          className={cn(
            "border-0 px-2.5 py-0.5 text-[11px] font-medium",
            row.original.status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-muted text-muted-foreground",
          )}
        >
          {row.original.status === "active" ? "Active" : "Offline"}
        </Badge>
      </div>
    ),
  },
]
