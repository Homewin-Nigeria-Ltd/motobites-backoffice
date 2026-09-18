import type { ReactNode } from "react"
import type { DateRange } from "react-day-picker"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DashboardDateRangePicker } from "@/features/dashboard/components/dashboard-date-range-picker"
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

const PERIOD_OPTIONS: Array<{
  value: SalesDashboardOperationalReportsPeriod
  label: string
}> = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "custom", label: "Custom Range" },
  { value: "24h", label: "Last 24 hours" },
  { value: "3months", label: "Last 3 months" },
]

type OfflineOrderOverviewOperationalReportsCardProps = {
  report?: ApiSalesDashboardOperationalReports | null
  period: SalesDashboardOperationalReportsPeriod
  dateRange?: DateRange
  onPeriodChange: (period: SalesDashboardOperationalReportsPeriod) => void
  onDateRangeChange: (dateRange: DateRange | undefined) => void
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

function OperationalReportsBodySkeleton() {
  return (
    <div className="mt-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-56 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function OfflineOrderOverviewOperationalReportsCard({
  report,
  period,
  dateRange,
  onPeriodChange,
  onDateRangeChange,
  isLoading = false,
}: OfflineOrderOverviewOperationalReportsCardProps) {
  const refunds = report?.discounts_promotions_refunds ?? {
    discounted_or_promotional_orders: 0,
    discounted_or_promotional_sales_kobo: 0,
    discount_given_kobo: 0,
    refund_count: 0,
    refund_amount_kobo: 0,
  }
  const bestSellingProducts = report?.best_selling_products ?? []
  const mealPerformance = report?.meal_performance ?? []
  const categoryPerformance = report?.product_category_performance ?? []
  const orderChannelReport = report?.order_channel_report ?? []
  const paymentPerformance = report?.payment_performance ?? []
  const showCustomDatePicker = period === "custom"

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

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          {showCustomDatePicker ? (
            <DashboardDateRangePicker
              value={dateRange}
              onChange={onDateRangeChange}
              className="h-10 truncate px-2.5 text-xs"
            />
          ) : null}

          <Select
            value={period}
            onValueChange={(value) =>
              onPeriodChange(value as SalesDashboardOperationalReportsPeriod)
            }
            disabled={isLoading}
          >
            <SelectTrigger
              size="lg"
              className="w-full border-border bg-background font-normal sm:w-[12.5rem]"
            >
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent align="end">
              {PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <OperationalReportsBodySkeleton />
      ) : !report ? (
        <p className="mt-5 py-12 text-center text-sm text-muted-foreground">
          {period === "custom"
            ? "Select a custom date range to load operational reports."
            : "No operational report data for this period."}
        </p>
      ) : (
        <>
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
        <ReportTable title="Meal Performance">
          {mealPerformance.length > 0 ? (
            <div className="space-y-3">
              {mealPerformance.map((meal) => (
                <div
                  key={meal.menu_item_id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{meal.meal}</p>
                    <p className="text-muted-foreground">
                      {meal.units_sold} units ·{" "}
                      {formatOfflineOrderAmount(
                        resolveOfflineOrderAmount(meal.price, meal.price_kobo),
                      )}{" "}
                      each
                    </p>
                  </div>
                  <span className="font-semibold text-foreground">
                    {formatOfflineOrderAmount(
                      resolveOfflineOrderAmount(
                        meal.total_amount_sold,
                        meal.total_amount_sold_kobo,
                      ),
                    )}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No meal performance data yet.
            </p>
          )}
        </ReportTable>

        <ReportTable title="Best Selling Meals">
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
        </>
      )}
    </div>
  )
}
