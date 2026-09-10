"use client"

import { Cell, Pie, PieChart } from "recharts"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type {
  SalesTransactionPaymentMethodBreakdown,
  SalesTransactionRevenueSourceBreakdown,
} from "@/features/sales-transaction/types"
import { formatSalesTransactionAmount } from "@/features/sales-transaction/utils/format"
import { getSalesTransactionSourceBadgeClass } from "@/features/sales-transaction/utils/source-badge"

type SalesTransactionRevenueBreakdownProps = {
  sources: SalesTransactionRevenueSourceBreakdown[]
  paymentMethods: SalesTransactionPaymentMethodBreakdown[]
}

function buildSourceChartConfig(sources: SalesTransactionRevenueSourceBreakdown[]) {
  return sources.reduce<ChartConfig>((acc, source) => {
    acc[source.key] = {
      label: source.label,
      color: source.color,
    }
    return acc
  }, {})
}

export function SalesTransactionRevenueBreakdown({
  sources,
  paymentMethods,
}: SalesTransactionRevenueBreakdownProps) {
  const chartData = sources.map((source) => ({
    key: source.key,
    name: source.label,
    percent: source.percent,
    amount: source.amount,
    fill: `var(--color-${source.key})`,
  }))

  const chartConfig = buildSourceChartConfig(sources)

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-2xl border border-border bg-background p-5">
        <h3 className="text-base font-semibold text-foreground">
          Revenue by Source
        </h3>

        <div className="relative mx-auto mt-4 w-full max-w-[17rem]">
          <ChartContainer
            config={chartConfig}
            className="aspect-square w-full"
            initialDimension={{ width: 272, height: 272 }}
          >
            <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, _name, item) => [
                      `${value}% · ${formatSalesTransactionAmount(item.payload.amount)}`,
                      item.payload.name,
                    ]}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="percent"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="88%"
                paddingAngle={2}
                strokeWidth={0}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.key} fill={`var(--color-${entry.key})`} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Total
            </p>
            <p className="text-lg font-semibold text-foreground">₦2.45M</p>
          </div>
        </div>

        <ul className="mt-4 space-y-3">
          {sources.map((source) => (
            <li
              key={source.key}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: source.color }}
                />
                <span className="truncate text-foreground">
                  {source.label} ({source.percent}%)
                </span>
              </div>
              <span className="shrink-0 text-muted-foreground">
                {formatSalesTransactionAmount(source.amount)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5">
        <h3 className="text-base font-semibold text-foreground">
          Payment Method Breakdown
        </h3>

        <div className="mt-6 space-y-5">
          {paymentMethods.map((method) => (
            <div key={method.label}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-foreground">
                  {method.label} ({method.percent}%)
                </span>
                <span className="text-muted-foreground">
                  {formatSalesTransactionAmount(method.amount)}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", method.barClassName)}
                  style={{ width: `${method.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SalesTransactionTopItemsTable({
  items,
}: {
  items: Array<{
    rank: number
    name: string
    source: string
    sourceLabel: string
    unitsSold: number
    revenue: number
  }>
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <h3 className="mb-4 text-base font-semibold text-foreground">
        Top Performing Items by Channel Source
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-3 pr-4 font-medium">Rank</th>
              <th className="pb-3 pr-4 font-medium">Menu Offering Name</th>
              <th className="pb-3 pr-4 font-medium">Primary Channel</th>
              <th className="pb-3 pr-4 font-medium">Units Sold</th>
              <th className="pb-3 font-medium">Estimated Revenue</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.rank} className="border-b border-border/60 last:border-0">
                <td className="py-4 pr-4 font-medium text-foreground">
                  {item.rank}
                </td>
                <td className="max-w-[240px] py-4 pr-4 font-medium text-foreground">
                  {item.name}
                </td>
                <td className="py-4 pr-4">
                  <Badge
                    className={cn(
                      "border-0 px-2.5 py-0.5 text-[11px] font-medium",
                      getSalesTransactionSourceBadgeClass(item.source),
                    )}
                  >
                    {item.sourceLabel}
                  </Badge>
                </td>
                <td className="py-4 pr-4 text-muted-foreground">
                  {item.unitsSold}
                </td>
                <td className="py-4 font-semibold text-foreground">
                  {formatSalesTransactionAmount(item.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
