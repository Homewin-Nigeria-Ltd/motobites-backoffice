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
import { useTicketDashboard, useTicketList } from "@/features/ticket/hooks/use-ticket-queries"
import type { TicketPeriod } from "@/features/ticket/types"
import { DataTable } from "@/components/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"

const TABLE_PAGE_SIZE = 8

export function TicketSection() {
  const [overviewPeriod, setOverviewPeriod] = useState<TicketPeriod>("monthly")
  const [createOpen, setCreateOpen] = useState(false)
  const [viewTicketId, setViewTicketId] = useState<string | null>(null)
  const [viewTicketOpen, setViewTicketOpen] = useState(false)
  const [dismissedAlert, setDismissedAlert] = useState(false)
  const [tablePage, setTablePage] = useState(1)

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

  const handleViewTicket = (ticketId: string) => {
    setViewTicketId(ticketId)
    setViewTicketOpen(true)
  }

  const {
    data: dashboard,
    isPending: isOverviewPending,
    isError: isOverviewError,
    error: overviewError,
  } = useTicketDashboard({ period: overviewPeriod })

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

  if (isOverviewPending && !dashboard) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isOverviewError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {overviewError instanceof Error
            ? overviewError.message
            : "Failed to load customer support dashboard."}
        </div>
      </div>
    )
  }

  if (!dashboard) {
    return null
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-x-hidden bg-muted p-4 md:gap-8 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {dashboard.alert && !dismissedAlert ? (
          <div className="min-w-0 flex-1">
            <TicketAlertBanner
              alert={dashboard.alert}
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

      <TicketSummaryCards
        kpis={dashboard.summaryKpis}
        isLoading={isOverviewPending}
      />

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <TicketResolutionChart
          resolutionRate={dashboard.resolutionRate}
          period={overviewPeriod}
          onPeriodChange={setOverviewPeriod}
        />
        <TicketByIssueChart
          ticketsByIssue={dashboard.ticketsByIssue}
          period={overviewPeriod}
          onPeriodChange={setOverviewPeriod}
        />
      </div>

      <TicketsRaisedChart
        ticketsRaised={dashboard.ticketsRaised}
        period={overviewPeriod}
        onPeriodChange={setOverviewPeriod}
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
        issueCategories={dashboard.issueCategories}
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
