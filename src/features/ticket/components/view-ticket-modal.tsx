"use client"

import { useMemo, useState, type ReactNode } from "react"

import { TicketResolverCombobox } from "@/features/ticket/components/ticket-resolver-combobox"
import { TicketStatusBadge } from "@/features/ticket/components/ticket-status-badge"
import {
  useAssignTicketResolver,
  useUpdateTicketStatus,
} from "@/features/ticket/hooks/use-ticket-mutations"
import {
  useTicketDetail,
  useTicketStaffResolvers,
} from "@/features/ticket/hooks/use-ticket-queries"
import {
  ticketAdminStatusOptions,
  type SupportTicket,
  type TicketAdminStatus,
  type TicketStatus,
} from "@/features/ticket/types"
import { findStaffByResolverId } from "@/features/ticket/utils/staff-resolver"
import { TICKET_STATUS_LABELS } from "@/features/ticket/utils/ticket"
import type { StaffMember } from "@/features/staff/types"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AppLoader } from "@/components/ui/app-loader"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

const detailGrid = "grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2"
const detailField = "min-w-0 space-y-1.5"
const detailLabel = "text-sm text-muted-foreground"
const detailValue = "text-sm font-medium text-foreground"

type ViewTicketModalProps = {
  ticketId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function DetailField({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn(detailField, className)}>
      <p className={detailLabel}>{label}</p>
      <div className={detailValue}>{children}</div>
    </div>
  )
}

function isTicketAdminStatus(value: TicketStatus): value is TicketAdminStatus {
  return ticketAdminStatusOptions.includes(value as TicketAdminStatus)
}

function getDefaultResolverId(
  staff: StaffMember[],
  resolverId: SupportTicket["resolverId"]
) {
  const matchedStaff = findStaffByResolverId(staff, resolverId)

  return matchedStaff
    ? String(matchedStaff.userId)
    : resolverId != null
      ? String(resolverId)
      : ""
}

type TicketResolverFieldProps = {
  ticket: SupportTicket
  staff: StaffMember[]
  isAssigningResolver: boolean
  onAssignResolver: (input: {
    ticketId: string
    resolverId: number
  }) => Promise<{ success: boolean }>
}

function TicketResolverField({
  ticket,
  staff,
  isAssigningResolver,
  onAssignResolver,
}: TicketResolverFieldProps) {
  const defaultResolverId = useMemo(
    () => getDefaultResolverId(staff, ticket.resolverId),
    [staff, ticket.resolverId]
  )
  const [selectedResolverId, setSelectedResolverId] = useState(defaultResolverId)

  const handleResolverChange = (value: string) => {
    setSelectedResolverId(value)

    const resolverId = Number(value)
    if (!value || Number.isNaN(resolverId) || resolverId === ticket.resolverId) {
      return
    }

    void onAssignResolver({ ticketId: ticket.id, resolverId }).then((result) => {
      if (!result.success) {
        setSelectedResolverId(defaultResolverId)
      }
    })
  }

  return (
    <TicketResolverCombobox
      id="ticket-resolver"
      staff={staff}
      value={selectedResolverId}
      onChange={handleResolverChange}
      placeholder="Select staff member"
      disabled={isAssigningResolver}
      className="max-w-sm"
    />
  )
}

export function ViewTicketModal({
  ticketId,
  open,
  onOpenChange,
}: ViewTicketModalProps) {
  const { data: ticket, isPending, isError, error } = useTicketDetail(
    ticketId,
    open
  )
  const {
    data: staffData,
    isPending: isStaffPending,
    isError: isStaffError,
  } = useTicketStaffResolvers(open)
  const { updateStatus, isPending: isUpdatingStatus } = useUpdateTicketStatus()
  const { assignResolver, isPending: isAssigningResolver } =
    useAssignTicketResolver()

  const staff = useMemo(() => staffData?.items ?? [], [staffData?.items])

  if (!open || !ticketId) {
    return null
  }

  const modalProps = {
    title: "Ticket Details",
    open,
    onOpenChange,
    layout: "detail" as const,
    size: "lg" as const,
    className: "max-w-[40rem]",
  }

  if (isPending) {
    return (
      <BaseModal {...modalProps}>
        <AppLoader className="min-h-48" />
      </BaseModal>
    )
  }

  if (isError || !ticket) {
    return (
      <BaseModal {...modalProps}>
        <p className="text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load ticket details."}
        </p>
      </BaseModal>
    )
  }

  const handleStatusChange = (status: TicketAdminStatus) => {
    if (status === ticket.status) {
      return
    }

    void updateStatus({ ticketId: ticket.id, status })
  }

  const currentAdminStatus = isTicketAdminStatus(ticket.status)
    ? ticket.status
    : null

  return (
    <BaseModal {...modalProps}>
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-lg font-semibold text-foreground">
            {ticket.ticketNumber}
          </p>
          <TicketStatusBadge
            status={ticket.status}
            label={ticket.statusLabel}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isUpdatingStatus}
              className="h-9 w-fit gap-2 rounded-lg border-border bg-background px-4 font-normal shadow-none"
            >
              {isUpdatingStatus ? "Updating…" : "Change status"}
              <Icons.chevronDown size={16} className="opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {ticketAdminStatusOptions.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={
                  isUpdatingStatus ||
                  currentAdminStatus === status
                }
              >
                {TICKET_STATUS_LABELS[status]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={detailGrid}>
        <DetailField label="Ticket Type">{ticket.typeLabel}</DetailField>
        <DetailField label="Issue Category">
          {ticket.issueCategoryLabel}
        </DetailField>
        <DetailField label="Created By">{ticket.createdBy}</DetailField>
        <DetailField label="Created Date">{ticket.createdAt}</DetailField>
        <DetailField label="Resolver">
          {isStaffPending ? (
            <AppLoader className="py-4" spinnerClassName="size-5" />
          ) : isStaffError ? (
            <p className="text-sm font-normal text-destructive">
              Failed to load staff list.
            </p>
          ) : staff.length === 0 ? (
            <p className="text-sm font-normal text-muted-foreground">
              No staff members available.
            </p>
          ) : (
            <TicketResolverField
              key={`${ticket.id}-${ticket.resolverId}-${staff.length}`}
              ticket={ticket}
              staff={staff}
              isAssigningResolver={isAssigningResolver}
              onAssignResolver={assignResolver}
            />
          )}
        </DetailField>
        <DetailField label="TAT (DD:HH:MIN)">
          <span
            className={cn(
              ticket.tatUrgent ? "text-primary" : "text-foreground"
            )}
          >
            {ticket.tat}
          </span>
        </DetailField>
      </div>

      <DetailField label="Description" className="pt-2">
        <p className="font-normal leading-relaxed text-foreground">
          {ticket.description}
        </p>
      </DetailField>
    </BaseModal>
  )
}
