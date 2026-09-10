import Link from "next/link"

import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { salesTransactionColumns } from "@/features/sales-transaction/columns/sales-transaction-columns"
import type { SalesTransactionRow } from "@/features/sales-transaction/types"

type SalesTransactionRecentTableProps = {
  transactions: SalesTransactionRow[]
  isLoading?: boolean
}

export function SalesTransactionRecentTable({
  transactions,
  isLoading = false,
}: SalesTransactionRecentTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">
          Recent Transactions
        </h3>
        <Button asChild variant="link" className="h-auto p-0 text-primary">
          <Link href="/offline-order/sales-transaction/history">View All</Link>
        </Button>
      </div>

      <DataTable
        columns={salesTransactionColumns}
        data={transactions}
        isLoading={isLoading}
        emptyMessage="No recent transactions yet."
        className="border-0 rounded-none"
        tableClassName="min-w-[42rem]"
      />
    </div>
  )
}
