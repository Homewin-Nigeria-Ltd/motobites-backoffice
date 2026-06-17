"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { RiderRowActions } from "./components/rider-row-actions"
import { RiderStatusBadge } from "./components/rider-status-badge"
import type { ApiRider } from "./types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/utils/date"
import { getUserInitials } from "@/utils/get-initials"

export const riderColumns: ColumnDef<ApiRider>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const rider = row.original

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            {rider.profile.avatar ? (
              <AvatarImage src={rider.profile.avatar} alt={rider.name} />
            ) : null}
            <AvatarFallback className="bg-secondary text-sm font-semibold text-primary">
              {getUserInitials(rider.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{rider.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {rider.email}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge className="h-auto rounded-full border-0 bg-[#FFF6E5] px-3 py-1 text-xs font-medium capitalize text-[#C98A00]">
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {formatDate(row.original.created_at)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <RiderStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <RiderRowActions rider={row.original} />,
    enableHiding: false,
  },
]
