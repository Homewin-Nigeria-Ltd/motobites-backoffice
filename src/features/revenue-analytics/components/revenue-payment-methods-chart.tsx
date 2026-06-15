"use client"

import { Cell, Pie, PieChart } from "recharts"

import type { RevenuePaymentMethod } from "@/features/revenue-analytics/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
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
    <Card className="flex h-full min-w-0 flex-col gap-4 py-5">
      <CardHeader className="shrink-0 px-4 pb-0 sm:px-5">
        <CardTitle className="text-sm font-semibold text-foreground">
          Revenue Based on Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 pb-5 sm:px-5">
        {paymentMethods.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No payment method data for this period.
          </p>
        ) : (
          <>
            <div className="mx-auto w-full min-w-0 max-w-[17.5rem]">
              <ChartContainer
                config={config}
                className="aspect-square w-full min-w-0"
                initialDimension={{ width: 280, height: 280 }}
              >
                <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        nameKey="channel"
                        formatter={(value, _name, item) => [
                          `${value}%`,
                          item.payload?.name ?? String(_name),
                        ]}
                      />
                    }
                  />
                  <Pie
                    data={chartData}
                    dataKey="percent"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="58%"
                    outerRadius="88%"
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
                </PieChart>
              </ChartContainer>
            </div>

            <ul className="mt-4 flex min-w-0 flex-col gap-2.5">
              {paymentMethods.map((method, index) => (
                <li
                  key={method.channel}
                  className="flex min-w-0 items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        PAYMENT_COLORS[index % PAYMENT_COLORS.length],
                    }}
                  />
                  <span className="truncate">{method.label}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}
