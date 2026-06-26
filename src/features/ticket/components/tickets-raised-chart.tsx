"use client"

import { useId } from "react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import { TicketPeriodFilter } from "@/features/ticket/components/ticket-period-filter"
import type {
  TicketPeriod,
  TicketVolumeByStatus,
} from "@/features/ticket/types"
import { formatCompactCount } from "@/features/dashboard/utils/format"
import { formatTicketCount } from "@/features/ticket/utils/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type TicketsRaisedChartProps = {
  ticketsRaised: TicketVolumeByStatus[]
  period: TicketPeriod
  onPeriodChange: (value: TicketPeriod) => void
}

const chartConfig = {
  count: {
    label: "Tickets",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function TicketsRaisedChart({
  ticketsRaised,
  period,
  onPeriodChange,
}: TicketsRaisedChartProps) {
  const gradientId = useId().replace(/:/g, "")

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="flex flex-col gap-3 px-4 pb-0 sm:flex-row sm:items-start sm:justify-between sm:px-5">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold text-foreground">
            Number Of Tickets Raised
          </CardTitle>
        <p className="text-xs leading-relaxed text-muted-foreground">
          This section offers a comprehensive overview of the total number of
          support tickets raised, categorized by their current status (e.g.,
          Open, In Progress, Resolved, Closed). It provides valuable insights
          into the volume of customer inquiries and how efficiently they are
          being addressed.
        </p>
        </div>
        <TicketPeriodFilter value={period} onChange={onPeriodChange} />
      </CardHeader>
      <CardContent className="min-w-0 overflow-hidden px-2 pb-2 sm:px-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[320px] w-full min-w-0 max-w-full"
        >
          <BarChart
            accessibilityLayer
            data={ticketsRaised}
            barCategoryGap="18%"
            margin={{ left: 8, right: 12, top: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={gradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="5.56%" stopColor="rgba(255, 181, 65, 0.95)" />
                <stop offset="100%" stopColor="rgba(245, 150, 0, 0.55)" />
              </linearGradient>
            </defs>
            <YAxis
              width={48}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCompactCount(Number(value))}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    formatTicketCount(Number(value)),
                    "Tickets",
                  ]}
                />
              }
            />
            <Bar
              dataKey="count"
              fill={`url(#${gradientId})`}
              radius={[40, 40, 0, 0]}
              maxBarSize={88}
              stroke="none"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
