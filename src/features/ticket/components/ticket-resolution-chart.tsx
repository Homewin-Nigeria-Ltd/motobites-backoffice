"use client"

import { Cell, Pie, PieChart } from "recharts"

import { TicketPeriodFilter } from "@/features/ticket/components/ticket-period-filter"
import type { TicketPeriod, TicketResolutionRate } from "@/features/ticket/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type TicketResolutionChartProps = {
  resolutionRate: TicketResolutionRate
  period: TicketPeriod
  onPeriodChange: (value: TicketPeriod) => void
}

const RESOLUTION_CHART_COLORS = {
  within_tat: "var(--primary)",
  exceeded_tat: "hsl(220 35% 18%)",
} as const

const chartConfig = {
  within_tat: {
    label: "Within TAT",
    color: RESOLUTION_CHART_COLORS.within_tat,
  },
  exceeded_tat: {
    label: "Exceeded TAT",
    color: RESOLUTION_CHART_COLORS.exceeded_tat,
  },
} satisfies ChartConfig

export function TicketResolutionChart({
  resolutionRate,
  period,
  onPeriodChange,
}: TicketResolutionChartProps) {
  const chartData = [
    {
      key: "within_tat",
      name: "Within TAT",
      value: resolutionRate.withinTat,
      color: RESOLUTION_CHART_COLORS.within_tat,
      fill: "var(--color-within_tat)",
    },
    {
      key: "exceeded_tat",
      name: "Exceeded TAT",
      value: resolutionRate.exceededTat,
      color: RESOLUTION_CHART_COLORS.exceeded_tat,
      fill: "var(--color-exceeded_tat)",
    },
  ] as const

  const total = resolutionRate.withinTat + resolutionRate.exceededTat

  return (
    <Card className="flex h-full min-w-0 flex-col gap-4 py-5">
      <CardHeader className="flex flex-col gap-3 px-4 pb-0 sm:flex-row sm:items-start sm:justify-between sm:px-5">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-sm font-semibold text-foreground">
            Ticket Resolution Response Rate
          </CardTitle>
          <p className="text-xs leading-relaxed text-muted-foreground">
            This section provides an analysis or insights into ticket opened by
            new and returning customers.
          </p>
        </div>
        <TicketPeriodFilter value={period} onChange={onPeriodChange} />
      </CardHeader>
      <CardContent className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 pb-5 sm:px-5">
        {total === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No resolution data for this period.
          </p>
        ) : (
          <>
            <div className="mx-auto w-full min-w-0 max-w-[17.5rem]">
              <ChartContainer
                config={chartConfig}
                className="aspect-square w-full min-w-0"
                initialDimension={{ width: 280, height: 280 }}
              >
                <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, _name, item) => {
                          const count = Number(value)
                          const percent =
                            total > 0
                              ? ((count / total) * 100).toFixed(1)
                              : "0"

                          return [
                            `${percent}%`,
                            item.payload?.name ?? String(_name),
                          ]
                        }}
                      />
                    }
                  />
                  <Pie
                    data={[...chartData]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="88%"
                    paddingAngle={1}
                    strokeWidth={0}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.key} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>

            <ul className="mt-4 flex min-w-0 flex-col gap-2.5">
              {chartData.map((item) => (
                <li
                  key={item.key}
                  className="flex min-w-0 items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.name}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}
