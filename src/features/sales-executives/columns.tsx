"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { SalesExecutiveReviewButton } from "./components/sales-executive-review-dialog"
import { SalesExecutiveStatusBadge } from "./components/sales-executive-status-badge"
import type { SalesExecutive } from "./types"

export const salesExecutiveColumns: ColumnDef<SalesExecutive>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">
          {row.original.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {row.original.email}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "referralCode",
    header: "Referral code",
  },
  {
    accessorKey: "idType",
    header: "ID type",
  },
  {
    accessorKey: "bankName",
    header: "Bank",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate">{row.original.bankName}</p>
        <p className="truncate text-xs text-muted-foreground">
          {row.original.bankAccountNumber}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <SalesExecutiveStatusBadge status={row.original.status} />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Applied",
  },
  {
    id: "review",
    header: "Action",
    cell: ({ row }) => (
      <SalesExecutiveReviewButton application={row.original} />
    ),
  },
]
