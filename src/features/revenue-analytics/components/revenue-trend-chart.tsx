"use client"

import { useId } from "react"
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid } from "recharts"

import type { RevenueTrendPoint } from "@/features/revenue-analytics/types"
import { formatCompactCurrency } from "@/features/dashboard/utils/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type RevenueTrendChartProps = {
  revenueTrend: RevenueTrendPoint[]
}

const chartConfig = {
  current: {
    label: "Revenue",
    color: "var(--primary)",
  },
  previous: {
    label: "Last Year (2022)",
    color: "rgba(245, 150, 0, 0.35)",
  },
} satisfies ChartConfig

export function RevenueTrendChart({ revenueTrend }: RevenueTrendChartProps) {
  const gradientId = useId().replace(/:/g, "")
  const chartData = revenueTrend.map((point) => ({
    month: point.month,
    current: point.current_kobo / 100,
    previous: point.previous_year_kobo / 100,
  }))

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="px-5 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Revenue
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-2 sm:px-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[320px] w-full"
        >
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 8, right: 12, top: 8 }}
          >
            <defs>
              <linearGradient
                id={gradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="14.75%" stopColor="rgba(245, 150, 0, 0)" />
                <stop offset="100%" stopColor="rgba(245, 150, 0, 0.12)" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <YAxis
              width={48}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCompactCurrency(Number(value))}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => String(label)}
                  formatter={(value, name) => [
                    formatCompactCurrency(Number(value)),
                    name === "current" ? "Revenue" : "Last Year (2022)",
                  ]}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="current"
              stroke="none"
              fill={`url(#${gradientId})`}
              legendType="none"
              tooltipType="none"
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="var(--color-current)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="var(--color-previous)"
              strokeWidth={2}
              strokeDasharray="6 6"
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
