"use client"

import { Icons } from "@/components/ui/icons"
import type { PaymentPerformanceMethod } from "@/features/dashboard/types"
import {
  formatDashboardCount,
  formatDashboardKobo,
} from "@/features/dashboard/utils/format"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DashboardPaymentPerformanceCardProps = {
  paymentPerformance: PaymentPerformanceMethod[]
}

function getMethodMeta(method: string) {
  const normalized = method.toLowerCase()
  switch (normalized) {
    case "bank_transfer":
      return { label: "Bank Transfer", icon: Icons.landmark, color: "text-blue-600 bg-blue-500/10" }
    case "cash":
      return { label: "Cash", icon: Icons.banknote, color: "text-emerald-600 bg-emerald-500/10" }
    case "pos_card":
    case "card":
    case "pos":
      return { label: "POS / Card", icon: Icons.creditCard, color: "text-purple-600 bg-purple-500/10" }
    case "chowdeck":
      return { label: "Chowdeck", icon: Icons.store, color: "text-amber-600 bg-amber-500/10" }
    case "staff_credit":
      return { label: "Staff Credit", icon: Icons.group, color: "text-indigo-600 bg-indigo-500/10" }
    default:
      return {
        label: method.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        icon: Icons.circleHelp,
        color: "text-muted-foreground bg-muted",
      }
  }
}

export function DashboardPaymentPerformanceCard({
  paymentPerformance,
}: DashboardPaymentPerformanceCardProps) {
  const totalSuccessfulAmount = paymentPerformance.reduce(
    (acc, item) => acc + (item.successful?.amount_kobo ?? 0),
    0
  )
  const totalSuccessfulCount = paymentPerformance.reduce(
    (acc, item) => acc + (item.successful?.count ?? 0),
    0
  )
  const totalFailedCount = paymentPerformance.reduce(
    (acc, item) => acc + (item.failed?.count ?? 0),
    0
  )
  const totalPendingCount = paymentPerformance.reduce(
    (acc, item) => acc + (item.pending?.count ?? 0),
    0
  )
  const totalRefundedCount = paymentPerformance.reduce(
    (acc, item) => acc + (item.refunded?.count ?? 0),
    0
  )

  return (
    <Card className="flex flex-col gap-4 py-5">
      <CardHeader className="shrink-0 px-5 pb-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-foreground">
              Payment Performance by Channel
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Transaction breakdown and settlement volume across payment methods
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="outline" className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
              <Icons.checkCircle2 size={12} />
              <span>{formatDashboardCount(totalSuccessfulCount)} Successful</span>
            </Badge>
            {totalPendingCount > 0 ? (
              <Badge variant="outline" className="gap-1 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
                <Icons.clock size={12} />
                <span>{formatDashboardCount(totalPendingCount)} Pending</span>
              </Badge>
            ) : null}
            {totalFailedCount > 0 ? (
              <Badge variant="outline" className="gap-1 border-destructive/30 bg-destructive/10 text-destructive">
                <Icons.xCircle size={12} />
                <span>{formatDashboardCount(totalFailedCount)} Failed</span>
              </Badge>
            ) : null}
            {totalRefundedCount > 0 ? (
              <Badge variant="outline" className="gap-1 border-muted bg-muted text-muted-foreground">
                <Icons.rotateCcw size={12} />
                <span>{formatDashboardCount(totalRefundedCount)} Refunded</span>
              </Badge>
            ) : null}
          </div>
        </div>
      </CardHeader>


      <CardContent className="min-h-0 flex-1 px-5">
        {paymentPerformance.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No payment records found for this period.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {paymentPerformance.map((item) => {
              const meta = getMethodMeta(item.method)
              const Icon = meta.icon
              const successfulKobo = item.successful?.amount_kobo ?? 0
              const successfulCount = item.successful?.count ?? 0
              const sharePercent =
                totalSuccessfulAmount > 0
                  ? Math.round((successfulKobo / totalSuccessfulAmount) * 100)
                  : 0

              const hasIssues =
                (item.failed?.count ?? 0) > 0 ||
                (item.pending?.count ?? 0) > 0 ||
                (item.refunded?.count ?? 0) > 0

              return (
                <div
                  key={item.method}
                  className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-border"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${meta.color}`}
                        >
                          <Icon size={16} />
                        </div>

                        <span className="text-sm font-semibold text-foreground">
                          {meta.label}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {sharePercent}% of total
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-xl font-bold tracking-tight text-foreground">
                        {formatDashboardKobo(successfulKobo)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDashboardCount(successfulCount)} successful order
                        {successfulCount === 1 ? "" : "s"}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${sharePercent}%` }}
                      />
                    </div>
                  </div>

                  {hasIssues ? (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border/50 pt-2 text-[11px] text-muted-foreground">
                      {(item.pending?.count ?? 0) > 0 ? (
                        <span className="text-amber-600 dark:text-amber-400">
                          {item.pending.count} pending ({formatDashboardKobo(item.pending.amount_kobo)})
                        </span>
                      ) : null}
                      {(item.failed?.count ?? 0) > 0 ? (
                        <span className="text-destructive">
                          {item.failed.count} failed ({formatDashboardKobo(item.failed.amount_kobo)})
                        </span>
                      ) : null}
                      {(item.refunded?.count ?? 0) > 0 ? (
                        <span className="text-muted-foreground">
                          {item.refunded.count} refunded
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
