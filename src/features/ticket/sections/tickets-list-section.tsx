"use client"

import { useMemo, useState } from "react"

import { createTicketColumns } from "@/features/ticket/columns"
import { TicketsListToolbar } from "@/features/ticket/components/tickets-list-toolbar"
import { ViewTicketModal } from "@/features/ticket/components/view-ticket-modal"
import { useTicketList } from "@/features/ticket/hooks/use-ticket-queries"
import { DataTable } from "@/components/data-table"
import { AppLoader } from "@/components/ui/app-loader"

const TABLE_PAGE_SIZE = 20

export function TicketsListSection() {
  const [tablePage, setTablePage] = useState(1)
  const [viewTicketId, setViewTicketId] = useState<string | null>(null)
  const [viewTicketOpen, setViewTicketOpen] = useState(false)

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

  const {
    data: ticketList,
    isPending,
    isFetching,
    isError,
    error,
  } = useTicketList({
    page: tablePage,
    per_page: TABLE_PAGE_SIZE,
  })

  const tickets = ticketList?.items ?? []
  const totalPages = ticketList?.meta.last_page ?? 1
  const currentPage = ticketList?.meta.current_page ?? tablePage

  if (isPending && tickets.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load tickets."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <section className="min-w-0">
        <DataTable
          columns={columns}
          data={tickets}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setTablePage}
          isLoading={isPending || (isFetching && tickets.length === 0)}
          className="min-w-0"
          toolbar={<TicketsListToolbar />}
        />
      </section>

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
