import Link from "next/link"

import { Button } from "@/components/ui/button"

export function SalesTransactionQuickActions() {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <h3 className="mb-4 text-base font-semibold text-foreground">
        Quick Actions
      </h3>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button asChild className="sm:min-w-[12rem]">
          <Link href="/offline-order/new">Create Offline Order</Link>
        </Button>
        <Button asChild variant="outline" className="sm:min-w-[12rem]">
          <Link href="/offline-order/sales-transaction/history">Export Report</Link>
        </Button>
        <Button asChild variant="outline" className="sm:min-w-[12rem]">
          <Link href="/offline-order/saved">View Saved Orders</Link>
        </Button>
      </div>
    </div>
  )
}
