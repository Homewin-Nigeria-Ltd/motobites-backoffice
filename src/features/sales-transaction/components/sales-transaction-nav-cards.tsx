import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import type { SalesTransactionHistoryPreviewRow } from "@/features/sales-transaction/types"
import { formatSalesTransactionAmount } from "@/features/sales-transaction/utils/format"
import { getSalesTransactionStatusBadgeClass } from "@/features/sales-transaction/utils/status-badge"

type SalesTransactionNavCardsProps = {
  historyPreview: SalesTransactionHistoryPreviewRow[]
  isLoading?: boolean
}

function TransactionHistoryCard({
  historyPreview,
  isLoading = false,
}: {
  historyPreview: SalesTransactionHistoryPreviewRow[]
  isLoading?: boolean
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon name="fileText" className="size-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Transaction History
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Search, filter, and track all completed and pending orders across
            every sales channel.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3 rounded-xl bg-muted/50 p-4">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="min-w-0 space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
            </div>
          ))
        ) : historyPreview.length > 0 ? (
          historyPreview.map((row) => (
            <div
              key={row.transactionNumber}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground">
                  {row.transactionNumber}
                </p>
                <p className="text-muted-foreground">
                  {formatSalesTransactionAmount(row.amount)}
                </p>
              </div>
              <Badge
                className={cn(
                  "border-0 px-2 py-0.5 text-[11px] font-medium",
                  getSalesTransactionStatusBadgeClass(row.status),
                )}
              >
                {row.status}
              </Badge>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No recent transactions yet.
          </p>
        )}
      </div>

      <Link
        href="/offline-order/sales-transaction/history"
        className="mt-auto pt-5 text-sm font-medium text-primary hover:underline"
      >
        View Transactions →
      </Link>
    </div>
  )
}

function TransactionAnalyticsCard() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
          <Icon name="performance" className="size-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Transaction Analytics
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Compare revenue by source, payment method, and time period with
            trend analysis.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-1 items-end rounded-xl bg-muted/50 p-4">
        <svg
          viewBox="0 0 240 80"
          className="h-20 w-full text-primary"
          aria-hidden="true"
        >
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="0,60 30,45 60,52 90,28 120,38 150,18 180,30 210,12 240,22"
          />
        </svg>
      </div>

      <Link
        href="/offline-order/sales-transaction/analytics"
        className="mt-auto pt-5 text-sm font-medium text-primary hover:underline"
      >
        View Analytics →
      </Link>
    </div>
  )
}

export function SalesTransactionNavCards({
  historyPreview,
  isLoading = false,
}: SalesTransactionNavCardsProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <TransactionHistoryCard
        historyPreview={historyPreview}
        isLoading={isLoading}
      />
      <TransactionAnalyticsCard />
    </div>
  )
}
