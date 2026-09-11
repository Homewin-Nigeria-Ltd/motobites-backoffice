import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import type {
  SalesTransactionAnalyticsPreview,
  SalesTransactionHistoryPreviewRow,
} from "@/features/sales-transaction/types"
import { formatSalesTransactionAmount } from "@/features/sales-transaction/utils/format"
import { getSalesTransactionSourceBadgeClass } from "@/features/sales-transaction/utils/source-badge"
import { getSalesTransactionStatusBadgeClass } from "@/features/sales-transaction/utils/status-badge"

type SalesTransactionNavCardsProps = {
  historyPreview: SalesTransactionHistoryPreviewRow[]
  analyticsPreview?: SalesTransactionAnalyticsPreview | null
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

function TransactionAnalyticsCard({
  analyticsPreview,
  isLoading = false,
}: {
  analyticsPreview?: SalesTransactionAnalyticsPreview | null
  isLoading?: boolean
}) {
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

      <div className="mt-5 flex flex-1 flex-col justify-end rounded-xl bg-muted/50 p-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
              </div>
            ))}
          </div>
        ) : analyticsPreview?.sources.length ? (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Revenue by source · {analyticsPreview.date}
            </p>
            {analyticsPreview.sources.map((source) => (
              <div key={source.source}>
                <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                  <Badge
                    className={cn(
                      "border-0 px-2 py-0.5 font-medium",
                      getSalesTransactionSourceBadgeClass(source.source),
                    )}
                  >
                    {source.sourceLabel}
                  </Badge>
                  <span className="font-medium text-foreground">
                    {formatSalesTransactionAmount(source.revenue)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(source.percent, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No analytics preview available yet.
          </p>
        )}
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
  analyticsPreview,
  isLoading = false,
}: SalesTransactionNavCardsProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <TransactionHistoryCard
        historyPreview={historyPreview}
        isLoading={isLoading}
      />
      <TransactionAnalyticsCard
        analyticsPreview={analyticsPreview}
        isLoading={isLoading}
      />
    </div>
  )
}
