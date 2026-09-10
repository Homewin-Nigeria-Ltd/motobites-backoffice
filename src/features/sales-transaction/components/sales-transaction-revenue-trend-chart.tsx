"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { SalesTransactionRevenueTrendPoint } from "@/features/sales-transaction/types"
import { formatSalesTransactionAmount } from "@/features/sales-transaction/utils/format"

type SalesTransactionRevenueTrendChartProps = {
  data: SalesTransactionRevenueTrendPoint[]
}

const chartConfig = {
  walk_in: {
    label: "Walk-in",
    color: "var(--primary)",
  },
  whatsapp: {
    label: "WhatsApp",
    color: "rgb(34, 197, 94)",
  },
  glovo: {
    label: "Glovo",
    color: "rgb(245, 158, 11)",
  },
  web: {
    label: "Web",
    color: "rgb(59, 130, 246)",
  },
  chowdeck: {
    label: "Chowdeck",
    color: "rgb(244, 63, 94)",
  },
} satisfies ChartConfig

export function SalesTransactionRevenueTrendChart({
  data,
}: SalesTransactionRevenueTrendChartProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Revenue by Source Over Time (Aug 2025)
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Daily values grouped by order channel sources
        </p>
      </div>

      <ChartContainer config={chartConfig} className="aspect-auto h-[320px] w-full">
        <LineChart data={data} margin={{ left: 8, right: 12, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
          />
          <YAxis
            width={56}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `₦${Math.round(Number(value) / 1000)}k`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => [
                  formatSalesTransactionAmount(Number(value)),
                  chartConfig[name as keyof typeof chartConfig]?.label ?? name,
                ]}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey="walk_in"
            stroke="var(--color-walk_in)"
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="whatsapp"
            stroke="var(--color-whatsapp)"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="glovo"
            stroke="var(--color-glovo)"
            strokeWidth={2}
            strokeDasharray="2 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="web"
            stroke="var(--color-web)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="chowdeck"
            stroke="var(--color-chowdeck)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
