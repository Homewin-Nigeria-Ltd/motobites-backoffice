"use client"

import Image from "next/image"
import { Icons } from "@/components/ui/icons"
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import type { RevenueSalesGenerated } from "@/features/revenue-analytics/types"
import { ASSETS } from "@/constants/assets"
import { PerformanceChartHeader } from "@/features/performance/components/performance-chart-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

type PerformanceSalesGeneratedChartProps = {
  salesGenerated: RevenueSalesGenerated
}

const chartConfig = {
  value: {
    label: "Sales",
    color: "rgba(34, 197, 94, 0.95)",
  },
} satisfies ChartConfig

type SalesChartPoint = {
  month: string
  value: number
  formatted: string
  change_percent: number
}

function MonthTick({
  x,
  y,
  payload,
  activeMonth,
}: {
  x?: string | number
  y?: string | number
  payload?: { value?: string }
  activeMonth: string
}) {
  const label = payload?.value ?? ""
  const isActive = label === activeMonth
  const tx = Number(x ?? 0)
  const ty = Number(y ?? 0)

  return (
    <g transform={`translate(${tx},${ty})`}>
      {isActive ? (
        <circle cx={0} cy={14} r={16} fill="rgba(34, 197, 94, 0.12)" />
      ) : null}
      <text
        x={0}
        y={14}
        textAnchor="middle"
        dominantBaseline="central"
        fill="hsl(var(--muted-foreground))"
        fontSize={12}
        fontWeight={isActive ? 600 : 400}
      >
        {label}
      </text>
    </g>
  )
}

function SalesGeneratedTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: SalesChartPoint }>
}) {
  if (!active || !payload?.length) {
    return null
  }

  const point = payload[0].payload
  const isUp = point.change_percent >= 0

  return (
    <div className="rounded-xl bg-background px-3 py-2.5 shadow-lg ring-1 ring-border">
      <div className="flex items-center gap-2">
        <Icons.thumbsUp className="size-4 shrink-0 text-emerald-600" aria-hidden />
        <span className="text-sm font-semibold text-foreground">
          {point.formatted} Income
        </span>
      </div>
      <p
        className={cn(
          "mt-1 text-xs font-medium",
          isUp ? "text-emerald-600" : "text-destructive",
        )}
      >
        {isUp ? "+" : ""}
        {point.change_percent}% from last month
      </p>
    </div>
  )
}

export function PerformanceSalesGeneratedChart({
  salesGenerated,
}: PerformanceSalesGeneratedChartProps) {
  const isUp = salesGenerated.trend === "up"
  const chartData = salesGenerated.series.map((point) => ({
    month: point.month,
    value: point.value_kobo / 100,
    formatted: point.formatted,
    change_percent: point.change_percent,
  }))
  const hasChartData =
    chartData.length > 0 && chartData.some((point) => point.value > 0)
  const activeMonth =
    chartData[Math.min(5, chartData.length - 1)]?.month ?? "Jun"
  const midpoint =
    chartData.length > 0
      ? chartData.reduce((sum, point) => sum + point.value, 0) /
        chartData.length
      : 0

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="gap-3 px-5 pb-0">
        <PerformanceChartHeader
          title="Sales Generated"
          icon={
            <Image
              src={ASSETS.illustrations.wallet}
              alt=""
              width={32}
              height={32}
              className="size-8 shrink-0"
              aria-hidden
            />
          }
        />
        <p className="text-3xl font-semibold tracking-tight text-foreground">
          {salesGenerated.formatted}
        </p>
        <span
          className={cn(
            "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
            isUp
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-destructive",
          )}
        >
          <Image
            src={
              isUp
                ? ASSETS.illustrations.shortUpTrend
                : ASSETS.illustrations.shortDownTrend
            }
            alt=""
            width={13}
            height={8}
            className="shrink-0"
            aria-hidden
          />
          {Math.abs(salesGenerated.change_percent)}%{" "}
          {salesGenerated.comparison_label}
        </span>
      </CardHeader>
      <CardContent className="px-2 pb-2 sm:px-4">
        {!hasChartData ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No sales data for this period.
          </p>
        ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 8, right: 12, top: 8, bottom: 8 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <YAxis hide domain={["auto", "auto"]} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tick={({ x, y, payload }) => (
                <MonthTick x={x} y={y} payload={payload} activeMonth={activeMonth} />
              )}
            />
            {midpoint > 0 ? (
              <ReferenceLine
                y={midpoint}
                stroke="hsl(var(--border))"
                strokeWidth={1}
              />
            ) : null}
            <ChartTooltip
              cursor={{
                fill: "rgba(34, 197, 94, 0.08)",
                width: 40,
              }}
              content={<SalesGeneratedTooltip />}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={{ r: 4, fill: "var(--color-value)", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "var(--color-value)", strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
