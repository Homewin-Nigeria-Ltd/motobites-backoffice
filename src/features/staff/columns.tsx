"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { StaffRowActions } from "@/features/staff/components/staff-row-actions"
import { StaffStatusBadge } from "@/features/staff/components/staff-status-badge"
import type { StaffMember } from "@/features/staff/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export const staffColumns: ColumnDef<StaffMember>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const member = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
              {member.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{member.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {member.email}
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
      <Badge
        variant="secondary"
        className="h-auto rounded-full border-0 bg-secondary px-3 py-1 text-xs font-medium text-primary"
      >
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "joinedAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {row.original.joinedAt}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StaffStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <StaffRowActions member={row.original} />,
    enableHiding: false,
  },
]
