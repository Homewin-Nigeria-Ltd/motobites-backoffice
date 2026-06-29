"use client"

import type { ColumnDef } from "@tanstack/react-table"

import type { UserInsightRow } from "@/features/promotions/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export const userInsightColumns: ColumnDef<UserInsightRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(event) => event.stopPropagation()}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.userId}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary/15 text-sm font-medium text-primary">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.status.toLowerCase() === "active"
      return (
        <Badge
          variant="secondary"
          className={cn(
            "h-auto rounded-full border-0 px-2.5 py-1 text-xs font-medium",
            isActive
              ? "bg-emerald-500/10 text-emerald-700"
              : "bg-muted text-muted-foreground"
          )}
        >
          {row.original.statusLabel}
        </Badge>
      )
    },
  },
  {
    accessorKey: "itemOrdered",
    header: "Item ordered",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.itemOrdered}
      </span>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.phoneNumber}
      </span>
    ),
  },
  {
    accessorKey: "amountSpent",
    header: "Amount Spent",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.amountSpent}
      </span>
    ),
  },
  {
    accessorKey: "promoCodeUsage",
    header: "Promocode Frequently",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.promoCodeUsage}
      </span>
    ),
  },
]
