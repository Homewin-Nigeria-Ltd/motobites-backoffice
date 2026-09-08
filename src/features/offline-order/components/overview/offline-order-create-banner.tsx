"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

export function OfflineOrderCreateBanner() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-primary p-5 text-primary-foreground md:flex-row md:items-center md:justify-between md:p-6">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <Icons.add size={24} className="text-white" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white">Create New Order</h2>
          <p className="max-w-2xl text-sm text-white/85">
            Start a new walk-in order, choose items from the digital menu, and
            configure tables.
          </p>
        </div>
      </div>

      <Button
        asChild
        variant="secondary"
        className="h-11 shrink-0 bg-white text-primary hover:bg-white/90"
      >
        <Link href="/offline-order/new">Start New Order</Link>
      </Button>
    </div>
  )
}
