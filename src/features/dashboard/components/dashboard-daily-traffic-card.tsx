"use client"

import Image from "next/image"
import { useId } from "react"
import { Bar, BarChart, XAxis } from "recharts"

import type { DashboardOverviewData } from "@/features/dashboard/types"
import { formatDashboardCount } from "@/features/dashboard/utils/format"
import { ASSETS } from "@/constants/assets"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

type DashboardDailyTrafficCardProps = {
  dailyTraffic: DashboardOverviewData["daily_traffic"]
}

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function DashboardDailyTrafficCard({
  dailyTraffic,
}: DashboardDailyTrafficCardProps) {
  const gradientId = useId().replace(/:/g, "")
  const isUp = dailyTraffic.trend === "up"
  const chartData = dailyTraffic.series.map((point) => ({
    label: point.label ?? "",
    users: point.value ?? 0,
  }))

  return (
    <Card className="h-full gap-4 py-5">
      <CardHeader className="px-5 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Daily Traffic
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {dailyTraffic.new_users}
          </p>
          <span className="text-sm text-muted-foreground">New Users</span>
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              isUp ? "text-emerald-600" : "text-destructive"
            )}
          >
            <Image
              src={
                isUp
                  ? ASSETS.illustrations.shortUpTrend
                  : ASSETS.illustrations.shortDownTrend
              }
              alt=""
              width={13}
              height={8}
              className="shrink-0"
              aria-hidden
            />
            <span>+{dailyTraffic.change_percent}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-4 sm:px-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[180px] w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <defs>
              <linearGradient
                id={gradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="5.56%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="rgba(255, 181, 65, 0.35)" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => formatDashboardCount(Number(value))}
                />
              }
            />
            <Bar
              dataKey="users"
              fill={`url(#${gradientId})`}
              barSize={20}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
