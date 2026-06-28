"use client"

import { Icons } from "@/components/ui/icons"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import type { RevenueTopRiderPerformance } from "@/features/revenue-analytics/types"
import { formatDashboardCount } from "@/features/dashboard/utils/format"
import { PerformanceChartHeader } from "@/features/performance/components/performance-chart-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type PerformanceTopRiderChartProps = {
  topRiderPerformance: RevenueTopRiderPerformance
}

const chartConfig = {
  deliveries: {
    label: "Deliveries",
    color: "rgba(245, 150, 0, 0.95)",
  },
} satisfies ChartConfig

const RIDER_AVATAR_COLORS = [
  "hsl(var(--muted-foreground))",
  "#111827",
  "#ec4899",
  "#f97316",
  "#6366f1",
  "#2563eb",
  "#64748b",
  "#ef4444",
  "#94a3b8",
  "#22c55e",
]

type RiderChartRow = {
  initials: string
  name: string
  deliveries: number
  avatarColor: string
}

function LollipopBar(props: {
  x?: string | number
  y?: string | number
  width?: string | number
  height?: string | number
  value?: number | [number, number]
}) {
  const x = Number(props.x ?? 0)
  const y = Number(props.y ?? 0)
  const width = Number(props.width ?? 0)
  const height = Number(props.height ?? 0)
  const value = Array.isArray(props.value) ? props.value[1] : props.value
  const cx = x + width / 2
  const color = chartConfig.deliveries.color

  if (!value || height <= 0 || width <= 0) {
    return <g />
  }

  return (
    <g>
      <line
        x1={cx}
        y1={y + height}
        x2={cx}
        y2={y}
        stroke={color}
        strokeWidth={2}
        strokeOpacity={0.35}
      />
      <circle cx={cx} cy={y} r={7} fill={color} />
    </g>
  )
}

function RiderTick(props: {
  x?: string | number
  y?: string | number
  index?: number
  payload?: { value?: string }
  chartData: RiderChartRow[]
}) {
  const x = Number(props.x ?? 0)
  const y = Number(props.y ?? 0)
  const index = props.index ?? 0
  const rider = props.chartData[index]
  const label = rider?.initials.slice(0, 1).toUpperCase() ?? "?"
  const color =
    rider?.avatarColor ??
    RIDER_AVATAR_COLORS[index % RIDER_AVATAR_COLORS.length]

  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx={0} cy={16} r={16} fill={color} />
      <text
        x={0}
        y={16}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize={11}
        fontWeight={600}
      >
        {label}
      </text>
    </g>
  )
}

export function PerformanceTopRiderChart({
  topRiderPerformance,
}: PerformanceTopRiderChartProps) {
  const chartData: RiderChartRow[] = topRiderPerformance.riders.map(
    (rider, index) => ({
      initials: rider.initials || rider.name.slice(0, 2),
      name: rider.name,
      deliveries: rider.deliveries,
      avatarColor:
        RIDER_AVATAR_COLORS[index % RIDER_AVATAR_COLORS.length],
    }),
  )
  const maxDeliveries = Math.max(
    ...chartData.map((rider) => rider.deliveries),
    1,
  )
  const yMax = maxDeliveries <= 20 ? 20 : Math.ceil(maxDeliveries / 5) * 5
  const yTicks =
    maxDeliveries <= 20 ? [0, 5, 10, 15, 20] : undefined

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="gap-3 px-5 pb-0">
        <PerformanceChartHeader
          title="Top Rider Performance"
          icon={
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icons.listAlt className="size-4" aria-hidden />
            </span>
          }
        />
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {formatDashboardCount(topRiderPerformance.total_deliveries)}{" "}
          <span className="text-base font-normal text-muted-foreground">
            Total Delivery
          </span>
        </p>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Icons.inventory className="size-4 shrink-0 text-primary" aria-hidden />
          <span>Optimize again to get your best score</span>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2 sm:px-4">
        {chartData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No rider performance data for this period.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[320px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 4, right: 12, top: 16, bottom: 28 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <YAxis
                width={32}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, yMax]}
                ticks={yTicks}
              />
              <XAxis
                dataKey="initials"
                tickLine={false}
                axisLine={false}
                tickMargin={20}
                interval={0}
              tick={({ x, y, payload, index }) => (
                <RiderTick
                  x={x}
                  y={y}
                  payload={payload}
                  index={index}
                  chartData={chartData}
                />
              )}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(_label, payload) =>
                      payload?.[0]?.payload?.name ?? "Rider"
                    }
                    formatter={(value) => [
                      formatDashboardCount(Number(value)),
                      "Deliveries",
                    ]}
                  />
                }
              />
              <Bar
                dataKey="deliveries"
                barSize={24}
                isAnimationActive={false}
                shape={({ x, y, width, height, value }) => (
                  <LollipopBar
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    value={value}
                  />
                )}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
