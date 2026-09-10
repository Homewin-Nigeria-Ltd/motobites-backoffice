import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type {
  ApiSalesDashboardOperationalReports,
  SalesDashboardOperationalReportsPeriod,
} from "@/features/offline-order/types"
import {
  getOrderSourceLabel,
  getPaymentMethodLabel,
} from "@/features/offline-order/utils/order-checkout"
import {
  formatOfflineOrderAmount,
  resolveOfflineOrderAmount,
} from "@/features/offline-order/utils/order-totals"
import { cn } from "@/lib/utils"

const PERIOD_OPTIONS: Array<{
  value: SalesDashboardOperationalReportsPeriod
  label: string
}> = [
  { value: "day", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
]

type OfflineOrderOverviewOperationalReportsCardProps = {
  report: ApiSalesDashboardOperationalReports
  period: SalesDashboardOperationalReportsPeriod
  onPeriodChange: (period: SalesDashboardOperationalReportsPeriod) => void
  isLoading?: boolean
}

function formatKoboAmount(amountKobo?: number | null) {
  return formatOfflineOrderAmount(resolveOfflineOrderAmount(null, amountKobo))
}

function formatGrowthPercent(value?: number | null) {
  const normalized = value ?? 0
  const prefix = normalized > 0 ? "+" : ""
  return `${prefix}${normalized.toFixed(2)}%`
}

function ReportTable({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <h4 className="mb-3 text-sm font-semibold text-foreground">{title}</h4>
      {children}
    </div>
  )
}

export function OfflineOrderOverviewOperationalReportsCard({
  report,
  period,
  onPeriodChange,
  isLoading = false,
}: OfflineOrderOverviewOperationalReportsCardProps) {
  const refunds = report.discounts_promotions_refunds ?? {
    discounted_or_promotional_orders: 0,
    discounted_or_promotional_sales_kobo: 0,
    discount_given_kobo: 0,
    refund_count: 0,
    refund_amount_kobo: 0,
  }
  const bestSellingProducts = report.best_selling_products ?? []
  const categoryPerformance = report.product_category_performance ?? []
  const orderChannelReport = report.order_channel_report ?? []
  const paymentPerformance = report.payment_performance ?? []

  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Operational Reports
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Offline sales performance for the selected period.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((option) => {
            const isActive = period === option.value

            return (
              <Button
                key={option.value}
                type="button"
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "h-9",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
                disabled={isLoading}
                onClick={() => onPeriodChange(option.value)}
              >
                {option.label}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">Period Sales</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {formatOfflineOrderAmount(
              resolveOfflineOrderAmount(report.sales, report.sales_kobo),
            )}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">Sales Growth</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {formatGrowthPercent(report.sales_growth_percent)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">Refunds</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {refunds.refund_count}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatKoboAmount(refunds.refund_amount_kobo)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">Promo Orders</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {refunds.discounted_or_promotional_orders}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatKoboAmount(refunds.discount_given_kobo)} discount given
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <ReportTable title="Best Selling Products">
          {bestSellingProducts.length > 0 ? (
            <div className="space-y-3">
              {bestSellingProducts.map((product) => (
                <div
                  key={`${product.rank}-${product.menu_item_id}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      #{product.rank} {product.product}
                    </p>
                    <p className="text-muted-foreground">
                      {product.units} units ·{" "}
                      {formatOfflineOrderAmount(
                        resolveOfflineOrderAmount(
                          product.unit_price,
                          product.unit_price_kobo,
                        ),
                      )}{" "}
                      each
                    </p>
                  </div>
                  <span className="font-semibold text-foreground">
                    {formatOfflineOrderAmount(
                      resolveOfflineOrderAmount(
                        product.sales,
                        product.sales_kobo,
                      ),
                    )}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No product data yet.</p>
          )}
        </ReportTable>

        <ReportTable title="Category Performance">
          {categoryPerformance.length > 0 ? (
            <div className="space-y-3">
              {categoryPerformance.map((category) => (
                <div
                  key={category.category}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {category.category}
                    </p>
                    <p className="text-muted-foreground">
                      {category.units} units ·{" "}
                      {(category.contribution_percent ?? 0).toFixed(2)}% share
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {formatOfflineOrderAmount(
                        resolveOfflineOrderAmount(
                          category.sales,
                          category.sales_kobo,
                        ),
                      )}
                    </p>
                    <Badge className="mt-1 border-0 bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                      {formatGrowthPercent(category.growth_percent)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No category data yet.
            </p>
          )}
        </ReportTable>

        <ReportTable title="Order Channels">
          {orderChannelReport.length > 0 ? (
            <div className="space-y-3">
              {orderChannelReport.map((channel, index) => (
                <div
                  key={`${channel.kitchen_id}-${channel.channel}-${index}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {channel.kitchen}
                    </p>
                    <p className="text-muted-foreground">
                      {getOrderSourceLabel(channel.channel)} · {channel.orders}{" "}
                      orders
                    </p>
                  </div>
                  <span className="font-semibold text-foreground">
                    {formatOfflineOrderAmount(
                      resolveOfflineOrderAmount(
                        channel.sales,
                        channel.sales_kobo,
                      ),
                    )}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No channel data yet.
            </p>
          )}
        </ReportTable>

        <ReportTable title="Payment Performance">
          {paymentPerformance.length > 0 ? (
            <div className="space-y-3">
              {paymentPerformance.map((payment) => (
                <div
                  key={payment.method}
                  className="rounded-lg border border-border bg-background p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-foreground">
                      {getPaymentMethodLabel(payment.method)}
                    </p>
                    <span className="font-semibold text-foreground">
                      {formatKoboAmount(payment.successful?.amount_kobo)}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>
                      Successful: {payment.successful?.count ?? 0} (
                      {formatKoboAmount(payment.successful?.amount_kobo)})
                    </span>
                    <span>Failed: {payment.failed?.count ?? 0}</span>
                    <span>Pending: {payment.pending?.count ?? 0}</span>
                    <span>Refunded: {payment.refunded?.count ?? 0}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No payment data yet.
            </p>
          )}
        </ReportTable>
      </div>
    </div>
  )
}
