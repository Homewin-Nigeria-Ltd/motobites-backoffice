"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import type { DashboardOrderAnalytics } from "@/features/dashboard/types"
import { formatDashboardCount } from "@/features/dashboard/utils/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type DashboardOrderAnalyticsCardProps = {
  orderAnalytics: DashboardOrderAnalytics
}

const hoursChartConfig = {
  orders: {
    label: "Orders",
    color: "var(--primary)",
  },
} satisfies ChartConfig

const daysChartConfig = {
  orders: {
    label: "Orders",
    color: "var(--chart-2, var(--primary))",
  },
} satisfies ChartConfig

function formatMinutes(value?: number | null) {
  if (value === null || value === undefined) {
    return "—"
  }

  const rounded = Number.isInteger(value) ? value : Math.round(value * 10) / 10

  return `${formatDashboardCount(rounded)} mins`
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  )
}

export function DashboardOrderAnalyticsCard({
  orderAnalytics,
}: DashboardOrderAnalyticsCardProps) {
  const peakHours = (orderAnalytics.peak_ordering_hours ?? []).map((point) => ({
    label: point.label ?? String(point.hour ?? ""),
    orders: point.orders ?? point.orders_count ?? point.value ?? 0,
  }))

  const peakDays = (orderAnalytics.peak_ordering_days ?? []).map((point) => ({
    label: point.label ?? point.day ?? "",
    orders: point.orders ?? point.orders_count ?? point.value ?? 0,
  }))

  const mostOrdered = orderAnalytics.most_ordered_meals ?? []

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Total Orders"
          value={formatDashboardCount(orderAnalytics.total_orders)}
        />
        <StatCard
          label="Completed"
          value={formatDashboardCount(orderAnalytics.completed_orders)}
        />
        <StatCard
          label="Pending"
          value={formatDashboardCount(orderAnalytics.pending_orders)}
        />
        <StatCard
          label="Cancelled"
          value={formatDashboardCount(orderAnalytics.cancelled_orders)}
        />
        <StatCard
          label="Failed"
          value={formatDashboardCount(orderAnalytics.failed_orders)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Avg Delivery Time"
          value={formatMinutes(orderAnalytics.average_delivery_time_minutes)}
        />
        <StatCard
          label="Avg Preparation Time"
          value={formatMinutes(orderAnalytics.average_preparation_time_minutes)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="flex h-[320px] flex-col gap-4 py-5 xl:col-span-1">
          <CardHeader className="shrink-0 px-5 pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Most Ordered Meals
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-5">
            {mostOrdered.length === 0 ? (
              <p className="py-6 text-sm text-muted-foreground">
                No meal data for this period.
              </p>
            ) : (
              mostOrdered.map((meal, index) => {
                const orderCount =
                  meal.order_count ?? meal.orders_count ?? 0
                const quantity = meal.quantity

                return (
                  <div
                    key={String(meal.id ?? `${meal.name}-${index}`)}
                    className="flex items-start justify-between gap-3 border-b border-border/70 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {meal.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDashboardCount(orderCount)} orders
                        {quantity !== undefined
                          ? ` · ${formatDashboardCount(quantity)} qty`
                          : ""}
                      </p>
                    </div>
                    {meal.revenue_formatted ? (
                      <p className="shrink-0 text-sm font-medium text-foreground">
                        {meal.revenue_formatted}
                      </p>
                    ) : null}
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card className="gap-4 py-5">
          <CardHeader className="px-5 pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Peak Ordering Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-2 sm:px-4">
            {peakHours.length === 0 ? (
              <p className="px-3 py-8 text-sm text-muted-foreground">
                No peak hour data for this period.
              </p>
            ) : (
              <ChartContainer
                config={hoursChartConfig}
                className="aspect-auto h-[240px] w-full"
              >
                <BarChart data={peakHours} margin={{ left: 4, right: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={40}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="orders"
                    fill="var(--color-orders)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="gap-4 py-5">
          <CardHeader className="px-5 pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Peak Ordering Days
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-2 sm:px-4">
            {peakDays.length === 0 ? (
              <p className="px-3 py-8 text-sm text-muted-foreground">
                No peak day data for this period.
              </p>
            ) : (
              <ChartContainer
                config={daysChartConfig}
                className="aspect-auto h-[240px] w-full"
              >
                <BarChart data={peakDays} margin={{ left: 4, right: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={40}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="orders"
                    fill="var(--color-orders)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
