"use client"

import { useMemo, useState } from "react"

import { createTicketColumns } from "@/features/ticket/columns"
import { CreateTicketDialog } from "@/features/ticket/components/create-ticket-dialog"
import { TicketAlertBanner } from "@/features/ticket/components/ticket-alert-banner"
import { TicketByIssueChart } from "@/features/ticket/components/ticket-by-issue-chart"
import { TicketResolutionChart } from "@/features/ticket/components/ticket-resolution-chart"
import { TicketSummaryCards } from "@/features/ticket/components/ticket-summary-cards"
import { TicketToolbar } from "@/features/ticket/components/ticket-toolbar"
import { TicketsRaisedChart } from "@/features/ticket/components/tickets-raised-chart"
import { ViewTicketModal } from "@/features/ticket/components/view-ticket-modal"
import {
  useTicketByIssue,
  useTicketByStatus,
  useTicketList,
  useTicketResolutionRate,
  useTicketSummary,
  useTicketUrgentAlert,
} from "@/features/ticket/hooks/use-ticket-queries"
import type { TicketPeriod, TicketResolutionRate } from "@/features/ticket/types"
import { DEFAULT_TICKET_ISSUE_CATEGORIES } from "@/features/ticket/utils/ticket"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"

const TABLE_PAGE_SIZE = 8
const DEFAULT_PERIOD: TicketPeriod = "month"

const EMPTY_RESOLUTION_RATE: TicketResolutionRate = {
  total: 0,
  withinTat: 0,
  exceededTat: 0,
}

export function TicketSection() {
  const [resolutionPeriod, setResolutionPeriod] =
    useState<TicketPeriod>(DEFAULT_PERIOD)
  const [byIssuePeriod, setByIssuePeriod] = useState<TicketPeriod>(DEFAULT_PERIOD)
  const [byStatusPeriod, setByStatusPeriod] =
    useState<TicketPeriod>(DEFAULT_PERIOD)

  const [createOpen, setCreateOpen] = useState(false)
  const [viewTicketId, setViewTicketId] = useState<string | null>(null)
  const [viewTicketOpen, setViewTicketOpen] = useState(false)
  const [dismissedAlert, setDismissedAlert] = useState(false)
  const [tablePage, setTablePage] = useState(1)

  const handleViewTicket = (ticketId: string) => {
    setViewTicketId(ticketId)
    setViewTicketOpen(true)
  }

  const columns = useMemo(
    () =>
      createTicketColumns({
        onViewTicket: (ticketId) => {
          setViewTicketId(ticketId)
          setViewTicketOpen(true)
        },
      }),
    []
  )

  const { data: summaryKpis, isPending: isSummaryPending } = useTicketSummary()

  const { data: resolutionRate } = useTicketResolutionRate({
    period: resolutionPeriod,
  })

  const { data: ticketsByIssue } = useTicketByIssue({ period: byIssuePeriod })

  const { data: ticketsRaised } = useTicketByStatus({ period: byStatusPeriod })

  const { data: urgentAlert } = useTicketUrgentAlert()

  const {
    data: ticketList,
    isPending: isListPending,
    isFetching: isListFetching,
  } = useTicketList({
    page: tablePage,
    per_page: TABLE_PAGE_SIZE,
  })

  const tickets = ticketList?.items ?? []
  const totalPages = ticketList?.meta.last_page ?? 1
  const currentPage = ticketList?.meta.current_page ?? tablePage

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-x-hidden bg-muted p-4 md:gap-8 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {urgentAlert && !dismissedAlert ? (
          <div className="min-w-0 flex-1">
            <TicketAlertBanner
              alert={urgentAlert}
              onDismiss={() => setDismissedAlert(true)}
              onViewTicket={handleViewTicket}
            />
          </div>
        ) : null}

        <Button
          type="button"
          className="h-10 shrink-0 self-end px-4 lg:self-center"
          icon={{ name: "add", position: "left" }}
          onClick={() => setCreateOpen(true)}
        >
          Create Ticket
        </Button>
      </div>

      <TicketSummaryCards kpis={summaryKpis ?? []} isLoading={isSummaryPending} />

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <TicketResolutionChart
          resolutionRate={resolutionRate ?? EMPTY_RESOLUTION_RATE}
          period={resolutionPeriod}
          onPeriodChange={setResolutionPeriod}
        />
        <TicketByIssueChart
          ticketsByIssue={ticketsByIssue ?? []}
          period={byIssuePeriod}
          onPeriodChange={setByIssuePeriod}
        />
      </div>

      <TicketsRaisedChart
        ticketsRaised={ticketsRaised ?? []}
        period={byStatusPeriod}
        onPeriodChange={setByStatusPeriod}
      />

      <section className="min-w-0">
        <DataTable
          columns={columns}
          data={tickets}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setTablePage}
          isLoading={isListPending || (isListFetching && tickets.length === 0)}
          className="min-w-0"
          toolbar={<TicketToolbar />}
        />
      </section>

      <CreateTicketDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        issueCategories={DEFAULT_TICKET_ISSUE_CATEGORIES}
      />

      <ViewTicketModal
        ticketId={viewTicketId}
        open={viewTicketOpen}
        onOpenChange={(open) => {
          setViewTicketOpen(open)
          if (!open) {
            setViewTicketId(null)
          }
        }}
      />
    </div>
  )
}
