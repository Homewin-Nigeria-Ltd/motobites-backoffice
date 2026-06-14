"use client"

import { useId } from "react"
import { Area, AreaChart, XAxis, YAxis } from "recharts"

import type { DashboardOverviewData } from "@/features/dashboard/types"
import { formatCompactCount, formatDashboardCount } from "@/features/dashboard/utils/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type DashboardOrderFrequencyCardProps = {
  orderFrequency: DashboardOverviewData["order_frequency"]
}

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function DashboardOrderFrequencyCard({
  orderFrequency,
}: DashboardOrderFrequencyCardProps) {
  const gradientId = useId().replace(/:/g, "")
  const chartData = orderFrequency.series.map((point) => ({
    label: point.label ?? "",
    orders: point.value ?? 0,
  }))

  return (
    <Card className="h-full gap-4 py-5">
      <CardHeader className="px-5 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Order Frequency
        </CardTitle>
        <p className="text-3xl font-semibold tracking-tight text-foreground">
          {formatDashboardCount(orderFrequency.total_orders)}{" "}
          <span className="text-lg font-medium text-muted-foreground">
            Orders
          </span>
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
              left: 4,
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
            <YAxis
              width={36}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCompactCount(Number(value))}
            />
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
                  formatter={(value) => formatDashboardCount(Number(value))}
                />
              }
            />
            <Area
              type="linear"
              dataKey="orders"
              stroke="var(--color-orders)"
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={{
                r: 4,
                fill: "var(--color-orders)",
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
                fill: "var(--foreground)",
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
