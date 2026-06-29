"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import type { PromotionInsightCustomerAcquisition } from "@/features/promotions/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

type OfferAcquisitionInsightCardProps = {
  acquisition: PromotionInsightCustomerAcquisition
}

const chartConfig = {
  count: {
    label: "Users",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function OfferAcquisitionInsightCard({
  acquisition,
}: OfferAcquisitionInsightCardProps) {
  const isUp = acquisition.trend === "up"
  const chartData = acquisition.distribution.map((item) => ({
    range: item.range,
    count: item.count,
  }))
  const peakCount = Math.max(...chartData.map((item) => item.count), 0)

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="space-y-3 px-5 pt-5 pb-0">
        <div className="flex items-center gap-2">
          <Icons.sparkles size={18} className="text-primary" />
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Customer Acquisition
          </CardTitle>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              {new Intl.NumberFormat("en-NG").format(acquisition.newUsers)}
            </p>
            <p className="text-sm text-muted-foreground">New User</p>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              isUp
                ? "bg-emerald-50 text-emerald-700"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {isUp ? "+" : ""}
            {acquisition.changePercent}% vs Previously
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-5 pt-4 sm:px-5">
        <ChartContainer config={chartConfig} className="aspect-[1.8/1] w-full">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="range"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis hide domain={[0, peakCount || 1]} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
