"use client"

import { Cell, Pie, PieChart } from "recharts"

import type { PromotionInsightRevenue } from "@/features/promotions/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

type OfferRevenueInsightCardProps = {
  revenue: PromotionInsightRevenue
}

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--primary)",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig

function formatSalesCount(value: number) {
  return new Intl.NumberFormat("en-NG").format(value)
}

export function OfferRevenueInsightCard({ revenue }: OfferRevenueInsightCardProps) {
  const isUp = revenue.trend === "up"
  const salesValue = Math.max(revenue.totalSales, 0)
  const chartData = [
    { key: "sales", value: salesValue || 1, fill: "var(--color-sales)" },
    { key: "remaining", value: salesValue > 0 ? salesValue * 0.35 : 1, fill: "var(--color-remaining)" },
  ]

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="space-y-3 px-5 pt-5 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icons.revenue size={18} className="text-primary" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue Generated
            </CardTitle>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            {revenue.statusLabel}
          </span>
        </div>
        <div>
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {revenue.formatted}
          </p>
          <p
            className={cn(
              "mt-1 text-sm font-medium",
              isUp ? "text-emerald-600" : "text-destructive"
            )}
          >
            {isUp ? "+" : ""}
            {revenue.changePercent}% from last month
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-[2/1] w-full max-w-[15rem]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius="68%"
              outerRadius="92%"
              strokeWidth={0}
              paddingAngle={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.key} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <p className="-mt-8 text-center text-sm font-medium text-foreground">
          {formatSalesCount(revenue.totalSales)} Sales
        </p>
      </CardContent>
    </Card>
  )
}
