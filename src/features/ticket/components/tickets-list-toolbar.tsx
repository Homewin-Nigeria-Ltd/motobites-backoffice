"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

export function TicketsListToolbar() {
  return (
    <div className="flex w-full items-center gap-3 border-b border-border px-4 py-4">
      <Button variant="ghost" size="icon-sm" className="shrink-0" asChild>
        <Link href="/customers/tickets" aria-label="Back to tickets">
          <Icons.chevronLeft size={20} />
        </Link>
      </Button>
      <h2 className="text-lg font-semibold text-foreground">All Tickets</h2>
    </div>
  )
}
