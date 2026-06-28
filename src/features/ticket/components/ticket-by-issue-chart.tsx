"use client"

import { useId } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { TicketPeriodFilter } from "@/features/ticket/components/ticket-period-filter"
import type {
  TicketIssueCategory,
  TicketPeriod,
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

type TicketByIssueChartProps = {
  ticketsByIssue: TicketIssueCategory[]
  period: TicketPeriod
  onPeriodChange: (value: TicketPeriod) => void
}

const chartConfig = {
  count: {
    label: "Tickets",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function TicketIssueSummary({ items }: { items: TicketIssueCategory[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.key} className="min-w-0">
          <p className="text-xs text-muted-foreground">{item.label}</p>
          <p className="mt-1 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {formatTicketCount(item.count)}
          </p>
        </div>
      ))}
    </div>
  )
}

export function TicketByIssueChart({
  ticketsByIssue,
  period,
  onPeriodChange,
}: TicketByIssueChartProps) {
  const gradientId = useId().replace(/:/g, "")

  return (
    <Card className="flex h-full min-w-0 flex-col gap-4 py-5">
      <CardHeader className="flex flex-col gap-3 px-4 pb-0 sm:flex-row sm:items-start sm:justify-between sm:px-5">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-sm font-semibold text-foreground">
            Ticket by Issue
          </CardTitle>
          <p className="text-xs leading-relaxed text-muted-foreground">
            This section provides an analysis or insights into ticket opened by
            new and returning customers.
          </p>
        </div>
        <TicketPeriodFilter value={period} onChange={onPeriodChange} />
      </CardHeader>

      <CardContent className="min-w-0 flex-1 space-y-6 overflow-hidden px-4 pb-5 sm:px-5">
        <TicketIssueSummary items={ticketsByIssue} />

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full min-w-0 max-w-full"
        >
          <BarChart
            accessibilityLayer
            data={ticketsByIssue}
            layout="vertical"
            margin={{ left: 4, right: 12, top: 4, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={gradientId}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0%" stopColor="rgba(245, 150, 0, 0.95)" />
                <stop offset="100%" stopColor="rgba(245, 150, 0, 0.08)" />
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontal={false}
              strokeDasharray="4 4"
              className="stroke-border/60"
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCompactCount(Number(value))}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={108}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick={{ fontSize: 10 }}
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
              radius={[0, 6, 6, 0]}
              barSize={32}
              stroke="none"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
