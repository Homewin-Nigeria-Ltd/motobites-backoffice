import Link from "next/link"

import { DataTable } from "@/components/data-table"
import { overviewTransactionsColumns } from "@/features/offline-order/columns/overview-transactions-columns"
import type { OfflineOrderOverviewTransactionRow } from "@/features/offline-order/types"
import { Button } from "@/components/ui/button"

type OfflineOrderOverviewTransactionsCardProps = {
  transactions: OfflineOrderOverviewTransactionRow[]
}

export function OfflineOrderOverviewTransactionsCard({
  transactions,
}: OfflineOrderOverviewTransactionsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">
          Recent Transactions
        </h3>
        <Button asChild variant="link" className="h-auto p-0 text-primary">
          <Link href="/offline-order/new">View All</Link>
        </Button>
      </div>

      <DataTable
        columns={overviewTransactionsColumns}
        data={transactions}
        emptyMessage="No recent transactions yet."
        className="border-0 rounded-none"
        tableClassName="min-w-[48rem]"
      />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button asChild variant="link" className="h-auto p-0 text-primary">
          <Link href="/order">Go to Transaction Management →</Link>
        </Button>
        <Button asChild variant="link" className="h-auto p-0 text-primary">
          <Link href="/revenue-analytics">View Transaction Analytics →</Link>
        </Button>
      </div>
    </div>
  )
}
