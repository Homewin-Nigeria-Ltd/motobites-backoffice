"use client"

import { Icons } from "@/components/ui/icons"
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import type { RevenueSalesByLocation } from "@/features/revenue-analytics/types"
import {
  formatCompactCount,
  formatDashboardCount,
} from "@/features/dashboard/utils/format"
import { PerformanceChartHeader } from "@/features/performance/components/performance-chart-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type PerformanceSalesReportChartProps = {
  salesByLocation: RevenueSalesByLocation
}

const LOCATION_META = {
  shomolu: { label: "Shomolu", color: "rgba(139, 92, 246, 0.95)" },
  ikoyi: { label: "Ikoyi", color: "rgba(34, 197, 94, 0.95)" },
  yaba: { label: "Yaba", color: "rgba(245, 150, 0, 0.95)" },
} as const

type LocationKey = keyof typeof LOCATION_META

const LOCATION_KEYS = Object.keys(LOCATION_META) as LocationKey[]

type SalesReportRow = {
  quarter: string
} & Record<string, string | number>

function buildChartConfig(): ChartConfig {
  return Object.entries(LOCATION_META).reduce<ChartConfig>(
    (acc, [key, meta]) => {
      acc[key] = { label: meta.label, color: meta.color }
      return acc
    },
    {},
  )
}

function buildChartData(salesByLocation: RevenueSalesByLocation): SalesReportRow[] {
  return salesByLocation.quarters.map((quarter) => {
    const row: SalesReportRow = { quarter: quarter.quarter }
    const locationMap = new Map(
      quarter.locations.map((location) => [location.key, location]),
    )

    LOCATION_KEYS.forEach((key) => {
      const location = locationMap.get(key)
      row[key] = location?.percent ?? 0
      row[`${key}_count`] = location?.count ?? 0
      row[`${key}_display`] = formatCompactCount(location?.count ?? 0)
    })

    return row
  })
}

function BarValueLabel({
  x: xProp = 0,
  y: yProp = 0,
  width: widthProp = 0,
  height: heightProp = 0,
  value,
  index = 0,
  dataKey,
  chartData,
}: {
  x?: string | number
  y?: string | number
  width?: string | number
  height?: string | number
  value?: number | string
  index?: number
  dataKey?: string | number
  chartData: SalesReportRow[]
}) {
  const x = Number(xProp)
  const y = Number(yProp)
  const width = Number(widthProp)
  const height = Number(heightProp)
  const key = String(dataKey ?? "")
  const row = chartData[index]
  const percent = Number(value ?? row?.[key] ?? 0)
  const countDisplay = String(row?.[`${key}_display`] ?? "")

  if (!Number.isFinite(percent) || percent <= 0 || height < 28) {
    return null
  }

  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fill="white"
      fontSize={10}
      fontWeight={600}
    >
      <tspan x={x + width / 2} dy="-0.4em">
        {percent}%
      </tspan>
      <tspan x={x + width / 2} dy="1.4em" fontSize={9} fontWeight={500}>
        {countDisplay}
      </tspan>
    </text>
  )
}

export function PerformanceSalesReportChart({
  salesByLocation,
}: PerformanceSalesReportChartProps) {
  const chartConfig = useMemo(() => buildChartConfig(), [])
  const chartData = useMemo(
    () => buildChartData(salesByLocation),
    [salesByLocation],
  )
  const hasChartValues = chartData.some((row) =>
    LOCATION_KEYS.some((key) => Number(row[key] ?? 0) > 0),
  )

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="gap-4 px-5 pb-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <PerformanceChartHeader
              title="Sales Report"
              info="Sales performance broken down by location."
              icon={
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Icons.fileSpreadsheet className="size-4" aria-hidden />
                </span>
              }
            />
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {formatDashboardCount(salesByLocation.total_sales)}{" "}
              <span className="text-base font-normal text-muted-foreground">
                Sales
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Sales based on Location
            </p>
          </div>
          <div className="flex flex-wrap gap-4 pt-1 text-sm text-muted-foreground">
            {LOCATION_KEYS.map((key) => (
              <span key={key} className="flex items-center gap-1.5">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: LOCATION_META[key].color }}
                />
                {LOCATION_META[key].label}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2 sm:px-4">
        {chartData.length === 0 || !hasChartValues ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No sales report data for this period.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[340px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 4, right: 12, top: 8, bottom: 8 }}
              barGap={8}
              barCategoryGap="20%"
            >
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <YAxis
                width={40}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <XAxis
                dataKey="quarter"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name, item) => {
                      const key = String(name)
                      const display = item.payload?.[`${key}_display`]

                      return [
                        `${value}% (${display ?? value})`,
                        LOCATION_META[key as LocationKey]?.label ?? key,
                      ]
                    }}
                  />
                }
              />
              {LOCATION_KEYS.map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={LOCATION_META[key].color}
                  barSize={40}
                  radius={[10, 10, 10, 10]}
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey={key}
                    content={({ x, y, width, height, value, index }) => (
                      <BarValueLabel
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        value={
                          typeof value === "number" || typeof value === "string"
                            ? value
                            : undefined
                        }
                        index={index}
                        dataKey={key}
                        chartData={chartData}
                      />
                    )}
                  />
                </Bar>
              ))}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
