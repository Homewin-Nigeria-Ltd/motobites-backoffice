"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

export function TicketToolbar() {
  return (
    <div className="flex w-full items-center justify-between gap-4 border-b border-border px-4 py-4">
      <h2 className="text-lg font-semibold text-foreground">
        Most Recent Ticket
      </h2>
      <Button type="button" className="h-10 shrink-0 px-4" asChild>
        <Link href="/customers/tickets/list">View All</Link>
      </Button>
    </div>
  )
}
