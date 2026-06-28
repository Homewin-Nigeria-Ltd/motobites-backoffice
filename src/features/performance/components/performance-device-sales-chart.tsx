"use client"

import { Icons } from "@/components/ui/icons"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import type { RevenueDeviceSales } from "@/features/revenue-analytics/types"
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

type PerformanceDeviceSalesChartProps = {
  deviceSales: RevenueDeviceSales
}

const chartConfig = {
  web_app: {
    label: "Web App",
    color: "rgba(34, 197, 94, 0.95)",
  },
  mobile: {
    label: "Mobile",
    color: "rgba(245, 150, 0, 0.95)",
  },
} satisfies ChartConfig

const BRAND_WEB_SHARE: Record<string, number> = {
  apple: 0.16,
  lenovo: 0.33,
  asus: 0.186,
  tecno: 0.186,
}

function formatAxisValue(value: number) {
  if (value >= 1_000) {
    return `${value / 1_000}K`
  }

  return String(value)
}

function buildChartData(deviceSales: RevenueDeviceSales) {
  const totalChannelSales =
    deviceSales.mobile.sales + deviceSales.web_app.sales || 1
  const defaultWebShare = deviceSales.web_app.sales / totalChannelSales

  return deviceSales.brands.map((brand) => {
    const webShare = BRAND_WEB_SHARE[brand.key] ?? defaultWebShare
    const webApp = Math.round(brand.sales * webShare)
    const mobile = brand.sales - webApp

    return {
      brand: brand.brand,
      web_app: webApp,
      mobile,
    }
  })
}

export function PerformanceDeviceSalesChart({
  deviceSales,
}: PerformanceDeviceSalesChartProps) {
  const chartData = buildChartData(deviceSales)

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="gap-4 px-5 pb-0">
        <PerformanceChartHeader
          title="Device Sales"
          icon={
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <Icons.monitorSmartphone className="size-4" aria-hidden />
            </span>
          }
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-orange-500">Mobile</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {formatDashboardCount(deviceSales.mobile.sales)}
            </p>
            <p className="text-sm text-muted-foreground">Sales</p>
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-600">Web App</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {formatDashboardCount(deviceSales.web_app.sales)}
            </p>
            <p className="text-sm text-muted-foreground">Sales</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2 sm:px-4">
        {chartData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No device sales data for this period.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[320px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="4 4" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 100_000]}
                ticks={[0, 20_000, 40_000, 60_000, 80_000, 100_000]}
                tickFormatter={(value) => formatAxisValue(Number(value))}
              />
              <YAxis
                type="category"
                dataKey="brand"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={56}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      formatCompactCount(Number(value)),
                      name === "mobile" ? "Mobile" : "Web App",
                    ]}
                  />
                }
              />
              <Bar
                dataKey="web_app"
                stackId="sales"
                fill="var(--color-web_app)"
                barSize={18}
              />
              <Bar
                dataKey="mobile"
                stackId="sales"
                fill="var(--color-mobile)"
                radius={[0, 4, 4, 0]}
                barSize={18}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
