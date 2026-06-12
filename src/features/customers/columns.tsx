"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"

import { CustomerStatusBadge } from "@/features/customers/components/customer-status-badge"
import type { Customer } from "@/features/customers/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export const customerColumns: ColumnDef<Customer>[] = [
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
      const customer = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary/15 text-sm font-medium text-primary">
              {customer.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <Link
              href={`/customers/${customer.id}`}
              className="truncate font-medium text-foreground hover:text-primary"
            >
              {customer.name}
            </Link>
            <p className="truncate text-xs text-muted-foreground">
              {customer.email}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <CustomerStatusBadge
        status={row.original.status}
        label={row.original.statusLabel}
      />
    ),
  },
  {
    accessorKey: "joinedAt",
    header: "Joined Date",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {row.original.joinedAt}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.phone}
      </span>
    ),
  },
  {
    accessorKey: "todayTransaction",
    header: "Today's Transaction",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.todayTransactionFormatted}
      </span>
    ),
  },
  {
    accessorKey: "walletBalance",
    header: "Wallet Balance",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.walletBalanceFormatted}
      </span>
    ),
  },
]
