"use client"

import type { PieLabelRenderProps } from "recharts"
import { Cell, Pie, PieChart } from "recharts"

import type { InventoryStockSummary } from "@/features/inventory/types"
import {
  getStockLevelChartColor,
  STOCK_LEVEL_CHART_COLORS,
} from "@/features/inventory/utils/stock-level"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icons"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type InventoryStockLevelChartProps = {
  stockSummary: InventoryStockSummary
}

type StockChartDatum = {
  key: "high" | "medium" | "low"
  name: string
  value: number
  percent: number
  fill: string
}

const chartConfig = {
  high: { label: "High Stock", color: STOCK_LEVEL_CHART_COLORS.high },
  medium: { label: "Medium Stock", color: STOCK_LEVEL_CHART_COLORS.medium },
  low: { label: "Low Stock", color: STOCK_LEVEL_CHART_COLORS.low },
} satisfies ChartConfig

function DoughnutPercentLabel({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  payload,
}: PieLabelRenderProps) {
  const percent =
    typeof payload === "object" &&
    payload !== null &&
    "percent" in payload &&
    typeof payload.percent === "number"
      ? payload.percent
      : 0

  if (percent <= 0) {
    return null
  }

  const inner = Number(innerRadius)
  const outer = Number(outerRadius)
  const radius = inner + (outer - inner) / 2
  const angle = (-midAngle * Math.PI) / 180
  const x = cx + radius * Math.cos(angle)
  const y = cy + radius * Math.sin(angle)
  const badgeRadius = 16

  return (
    <g filter="url(#inventory-doughnut-shadow)">
      <circle cx={x} cy={y} r={badgeRadius} fill="var(--card)" />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--foreground)"
        fontSize={11}
        fontWeight={600}
      >
        {percent}%
      </text>
    </g>
  )
}

export function InventoryStockLevelChart({
  stockSummary,
}: InventoryStockLevelChartProps) {
  const chartData: StockChartDatum[] = [
    {
      key: "high",
      name: "High Stock Product",
      value: stockSummary.high.count,
      percent: stockSummary.high.percent,
      fill: "var(--color-high)",
    },
    {
      key: "medium",
      name: "Medium Stock Product",
      value: stockSummary.medium.count,
      percent: stockSummary.medium.percent,
      fill: "var(--color-medium)",
    },
    {
      key: "low",
      name: "Low Stock Product",
      value: stockSummary.low.count,
      percent: stockSummary.low.percent,
      fill: "var(--color-low)",
    },
  ]

  const total = stockSummary.total_active
  const activeChartData = chartData.filter((item) => item.value > 0)

  return (
    <Card className="flex h-full min-w-0 flex-col gap-4 py-5">
      <CardHeader className="px-4 pb-0 sm:px-5">
        <CardTitle className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon name="inventory" size={18} />
          </span>
          Stock Level
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col px-4 pb-5 sm:px-5">
        {total === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No active inventory items yet.
          </p>
        ) : (
          <div className="flex min-w-0 flex-1 flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <div className="relative mx-auto shrink-0 sm:mx-0">
              <ChartContainer
                config={chartConfig}
                className="aspect-square w-[16rem] min-w-0 sm:w-[18rem] [&_.recharts-surface]:overflow-visible"
                initialDimension={{ width: 300, height: 300 }}
              >
                <PieChart margin={{ top: 36, right: 36, bottom: 36, left: 36 }}>
                  <defs>
                    <filter
                      id="inventory-doughnut-shadow"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="1"
                        stdDeviation="2"
                        floodColor="#000000"
                        floodOpacity="0.12"
                      />
                    </filter>
                  </defs>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, _name, item) => {
                          const count = Number(value)
                          const percent =
                            item.payload?.percent ??
                            (total > 0 ? Math.round((count / total) * 100) : 0)

                          return [`${percent}%`, item.payload?.name ?? String(_name)]
                        }}
                      />
                    }
                  />
                  <Pie
                    data={activeChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius="72%"
                    outerRadius="88%"
                    paddingAngle={3}
                    cornerRadius={6}
                    strokeWidth={0}
                    label={DoughnutPercentLabel}
                    labelLine={false}
                  >
                    {activeChartData.map((entry) => (
                      <Cell key={entry.key} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-2xl font-semibold text-primary sm:text-3xl">
                  {total.toLocaleString()}
                </p>
                <p className="max-w-[9rem] text-sm leading-snug text-muted-foreground">
                  Active In Stock
                </p>
              </div>
            </div>

            <ul className="flex min-w-0 flex-1 flex-col justify-center gap-5">
              {chartData.map((item) => (
                <li key={item.key} className="min-w-0 space-y-2">
                  <div className="flex gap-2 text-sm">
                    <span
                      className="mt-1.5 size-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: getStockLevelChartColor(item.key),
                      }}
                    />
                    <div className="min-w-0 space-y-1">
                      <p className="truncate font-medium uppercase tracking-wide text-foreground">
                        {item.name}
                      </p>
                      <p className="text-muted-foreground">
                        {item.value.toLocaleString()}{" "}
                        {item.value === 1 ? "Item" : "Items"}
                      </p>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(item.percent, item.value > 0 ? 4 : 0)}%`,
                        backgroundColor: getStockLevelChartColor(item.key),
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
