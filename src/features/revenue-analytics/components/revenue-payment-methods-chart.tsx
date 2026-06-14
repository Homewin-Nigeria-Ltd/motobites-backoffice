"use client"

import { Cell, Pie, PieChart } from "recharts"

import type { RevenuePaymentMethod } from "@/features/revenue-analytics/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type RevenuePaymentMethodsChartProps = {
  paymentMethods: RevenuePaymentMethod[]
}

const PAYMENT_COLORS = [
  "var(--primary)",
  "rgba(245, 150, 0, 0.75)",
  "rgba(255, 181, 65, 0.85)",
  "rgba(245, 150, 0, 0.45)",
  "rgba(255, 181, 65, 0.55)",
]

const chartConfig = {
  percent: {
    label: "Share",
  },
} satisfies ChartConfig

export function RevenuePaymentMethodsChart({
  paymentMethods,
}: RevenuePaymentMethodsChartProps) {
  const chartData = paymentMethods.map((method) => ({
    name: method.label,
    channel: method.channel,
    percent: method.percent,
    fill: `var(--color-${method.channel})`,
  }))

  const config = paymentMethods.reduce<ChartConfig>((acc, method, index) => {
    acc[method.channel] = {
      label: method.label,
      color: PAYMENT_COLORS[index % PAYMENT_COLORS.length],
    }
    return acc
  }, { ...chartConfig })

  return (
    <Card className="flex h-full flex-col gap-4 py-5">
      <CardHeader className="shrink-0 px-5 pb-0">
        <CardTitle className="text-sm font-semibold text-foreground">
          Revenue Based on Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 items-center justify-center px-5 pb-5">
        {paymentMethods.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No payment method data for this period.
          </p>
        ) : (
          <ChartContainer
            config={config}
            className="mx-auto aspect-square h-[280px] w-full max-w-[320px]"
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => [`${value}%`, String(name)]}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="percent"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                strokeWidth={0}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.channel}
                    fill={`var(--color-${entry.channel})`}
                  />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
