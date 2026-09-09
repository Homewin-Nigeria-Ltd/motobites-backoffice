"use client"

import { Icons } from "@/components/ui/icons"
import type { DiscountsPromotionsRefunds } from "@/features/dashboard/types"
import { formatDashboardCount, formatDashboardKobo } from "@/features/dashboard/utils/format"
import { cn } from "@/lib/utils"

type DashboardDiscountsRefundsCardProps = {
  data: DiscountsPromotionsRefunds
  salesKobo?: number
  salesGrowthPercent?: number
}

export function DashboardDiscountsRefundsCard({
  data,
  salesKobo,
  salesGrowthPercent,
}: DashboardDiscountsRefundsCardProps) {
  const isGrowthPositive = (salesGrowthPercent ?? 0) >= 0

  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Operational Sales & Commercial Adjustments
          </h3>
          <p className="text-xs text-muted-foreground">
            Promotions, customer discounts, and refund activities for this period
          </p>
        </div>
        {salesKobo !== undefined ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Total Period Sales</span>
              <p className="text-lg font-bold text-foreground">
                {formatDashboardKobo(salesKobo)}
              </p>
            </div>
            {salesGrowthPercent !== undefined ? (
              <div
                className={cn(
                  "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                  isGrowthPositive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {isGrowthPositive ? (
                  <Icons.arrowUpRight size={14} />
                ) : (
                  <Icons.arrowDownRight size={14} />
                )}
                <span>{Math.abs(salesGrowthPercent)}%</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Promotional Orders */}
        <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/40 p-3.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icons.priceTag size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">
              Promo Orders
            </p>
            <p className="text-xl font-bold tracking-tight text-foreground">
              {formatDashboardCount(data.discounted_or_promotional_orders)}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Discounted or promo
            </p>
          </div>
        </div>

        {/* Promo Sales Value */}
        <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/40 p-3.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
            <Icons.banknote size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">
              Promo Sales Volume
            </p>
            <p className="text-xl font-bold tracking-tight text-foreground">
              {formatDashboardKobo(data.discounted_or_promotional_sales_kobo)}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Gross sales with promo
            </p>
          </div>
        </div>

        {/* Discounts Given */}
        <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/40 p-3.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
            <Icons.percent size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">
              Total Discounts Given
            </p>
            <p className="text-xl font-bold tracking-tight text-foreground">
              {formatDashboardKobo(data.discount_given_kobo)}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Discount deductions
            </p>
          </div>
        </div>

        {/* Refunds */}
        <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/40 p-3.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <Icons.rotateCcw size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <p className="text-xs font-medium text-muted-foreground">
                Refunds ({data.refund_count})
              </p>
            </div>

            <p className="text-xl font-bold tracking-tight text-foreground">
              {formatDashboardKobo(data.refund_amount_kobo)}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {data.refund_count === 0
                ? "No refunds recorded"
                : `${formatDashboardCount(data.refund_count)} refunded order${data.refund_count === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
