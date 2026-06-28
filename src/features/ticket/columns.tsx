"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { TicketStatusBadge } from "@/features/ticket/components/ticket-status-badge"
import type { SupportTicket } from "@/features/ticket/types"
import { cn } from "@/lib/utils"

type CreateTicketColumnsOptions = {
  onViewTicket?: (ticketId: string) => void
}

export function createTicketColumns({
  onViewTicket,
}: CreateTicketColumnsOptions = {}): ColumnDef<SupportTicket>[] {
  return [
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {row.original.createdAt}
        </span>
      ),
    },
    {
      accessorKey: "ticketNumber",
      header: "Ticket ID",
      cell: ({ row }) => {
        const ticket = row.original

        if (onViewTicket) {
          return (
            <button
              type="button"
              className="whitespace-nowrap font-medium text-foreground hover:text-primary"
              onClick={() => onViewTicket(ticket.id)}
            >
              {ticket.ticketNumber}
            </button>
          )
        }

        return (
          <span className="whitespace-nowrap font-medium text-foreground">
            {ticket.ticketNumber}
          </span>
        )
      },
    },
    {
      accessorKey: "typeLabel",
      header: "Ticket Type",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-foreground">
          {row.original.typeLabel}
        </span>
      ),
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-foreground">
          {row.original.createdBy}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <TicketStatusBadge
          status={row.original.status}
          label={row.original.statusLabel}
        />
      ),
    },
    {
      id: "resolver",
      header: "Resolver",
      cell: ({ row }) => {
        const { resolverName, resolverRole } = row.original

        if (!resolverName) {
          return <span className="text-muted-foreground">—</span>
        }

        return (
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {resolverName}
            </p>
            {resolverRole ? (
              <p className="truncate text-xs text-muted-foreground">
                {resolverRole}
              </p>
            ) : null}
          </div>
        )
      },
    },
    {
      accessorKey: "tat",
      header: "TAT (DD:HH:MIN)",
      cell: ({ row }) => (
        <span
          className={cn(
            "whitespace-nowrap font-medium",
            row.original.tatUrgent ? "text-primary" : "text-foreground"
          )}
        >
          {row.original.tat}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="line-clamp-2 max-w-[16rem] text-foreground">
          {row.original.description}
        </span>
      ),
    },
  ]
}

export const ticketColumns = createTicketColumns()
