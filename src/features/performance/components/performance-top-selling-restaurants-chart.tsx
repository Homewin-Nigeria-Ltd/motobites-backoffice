"use client"

import { Icons } from "@/components/ui/icons"
import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import type { RevenueTopSellingRestaurant } from "@/features/revenue-analytics/types"
import { PerformanceChartHeader } from "@/features/performance/components/performance-chart-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type PerformanceTopSellingRestaurantsChartProps = {
  restaurants: RevenueTopSellingRestaurant[]
}

const RESTAURANT_COLORS = [
  "rgba(245, 150, 0, 0.95)",
  "rgba(239, 68, 68, 0.85)",
  "rgba(34, 197, 94, 0.85)",
]

function buildChartConfig(
  restaurants: RevenueTopSellingRestaurant[],
): ChartConfig {
  return restaurants.reduce<ChartConfig>((acc, restaurant, index) => {
    acc[restaurant.name] = {
      label: restaurant.name,
      color: RESTAURANT_COLORS[index % RESTAURANT_COLORS.length],
    }
    return acc
  }, {})
}

function buildChartData(restaurants: RevenueTopSellingRestaurant[]) {
  if (!restaurants.length) {
    return []
  }

  const months = restaurants[0]?.series.map((point) => point.month) ?? []

  return months.map((month) => {
    const row: Record<string, string | number> = { month }

    restaurants.forEach((restaurant) => {
      row[restaurant.name] =
        restaurant.series.find((point) => point.month === month)?.orders ?? 0
    })

    return row
  })
}

export function PerformanceTopSellingRestaurantsChart({
  restaurants,
}: PerformanceTopSellingRestaurantsChartProps) {
  const chartConfig = useMemo(
    () => buildChartConfig(restaurants),
    [restaurants],
  )
  const chartData = useMemo(() => buildChartData(restaurants), [restaurants])

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="gap-3 px-5 pb-0">
        <PerformanceChartHeader
          title="Top Selling Restaurants"
          icon={
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icons.store className="size-4" aria-hidden />
            </span>
          }
        />
        <div className="grid grid-cols-3 gap-4">
          {restaurants.map((restaurant, index) => {
            const isUp = restaurant.trend === "up"

            return (
              <div key={restaurant.kitchen_id} className="min-w-0">
                <p
                  className="truncate text-sm font-medium"
                  style={{
                    color: RESTAURANT_COLORS[index % RESTAURANT_COLORS.length],
                  }}
                >
                  {restaurant.name}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                  {isUp ? "+" : "-"}
                  {Math.abs(restaurant.change_percent)}%
                </p>
              </div>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2 sm:px-4">
        {restaurants.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No restaurant data for this period.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 0, right: 12, top: 8, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <YAxis
                width={32}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 40]}
                ticks={[0, 20, 40]}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                interval={0}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [String(value), String(name)]}
                  />
                }
              />
              {restaurants.map((restaurant, index) => (
                <Line
                  key={restaurant.kitchen_id}
                  type="monotone"
                  dataKey={restaurant.name}
                  stroke={
                    RESTAURANT_COLORS[index % RESTAURANT_COLORS.length]
                  }
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
