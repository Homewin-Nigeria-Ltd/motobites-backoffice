"use client"

import { useId } from "react"
import { Area, AreaChart, XAxis } from "recharts"

import type { DashboardOverviewData } from "@/features/dashboard/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type DashboardSalesRevenueChartProps = {
  salesRevenue: DashboardOverviewData["sales_revenue"]
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function DashboardSalesRevenueChart({
  salesRevenue,
}: DashboardSalesRevenueChartProps) {
  const gradientId = useId().replace(/:/g, "")
  const chartData = salesRevenue.series.map((point) => ({
    label: point.label,
    revenue: point.amount_kobo / 100,
    formatted_amount: point.formatted_amount,
  }))

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="px-5 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Sales Revenue
        </CardTitle>
        <p className="text-3xl font-semibold tracking-tight text-foreground">
          {salesRevenue.formatted_total}
        </p>
      </CardHeader>
      <CardContent className="px-2 pb-2 sm:px-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient
                id={gradientId}
                x1="0.566"
                y1="0.004"
                x2="0.434"
                y2="0.996"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="14.75%" stopColor="rgba(245, 150, 0, 0)" />
                <stop offset="100%" stopColor="rgba(245, 150, 0, 0.15)" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(_, __, item) =>
                    String(item.payload.formatted_amount)
                  }
                />
              }
            />
            <Area
              type="linear"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
