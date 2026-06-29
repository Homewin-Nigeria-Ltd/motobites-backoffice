"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import type { PromotionInsightCheckouts } from "@/features/promotions/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

type OfferCheckoutsInsightCardProps = {
  checkouts: PromotionInsightCheckouts
}

const chartConfig = {
  count: {
    label: "Checkouts",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function OfferCheckoutsInsightCard({
  checkouts,
}: OfferCheckoutsInsightCardProps) {
  const isUp = checkouts.trend === "up"
  const chartData = checkouts.weeklyBuckets.map((bucket) => ({
    week: bucket.weekLabel,
    count: bucket.count,
  }))
  const peakCount = Math.max(...chartData.map((item) => item.count), 0)

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="space-y-3 px-5 pt-5 pb-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icons.cart size={18} className="text-primary" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Check Out
            </CardTitle>
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              isUp ? "text-emerald-600" : "text-destructive"
            )}
          >
            {isUp ? "+" : ""}
            {checkouts.changePercent}%
          </span>
        </div>
        <p className="text-3xl font-semibold tracking-tight text-foreground">
          {new Intl.NumberFormat("en-NG").format(checkouts.value)}
        </p>
      </CardHeader>
      <CardContent className="px-2 pb-5 pt-4 sm:px-5">
        <ChartContainer config={chartConfig} className="aspect-[1.8/1] w-full">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
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
              maxBarSize={36}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
