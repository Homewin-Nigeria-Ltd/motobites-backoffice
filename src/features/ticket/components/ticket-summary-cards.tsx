"use client"

import Image from "next/image"

import type { TicketSummaryKpi } from "@/features/ticket/types"
import { formatTicketCount } from "@/features/ticket/utils/format"
import { ASSETS } from "@/constants/assets"
import { cn } from "@/lib/utils"

type TicketSummaryCardsProps = {
  kpis: TicketSummaryKpi[]
  isLoading?: boolean
}

function SummaryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <div className="space-y-4">
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

function SummaryCard({ kpi }: { kpi: TicketSummaryKpi }) {
  const isDanger = kpi.variant === "danger"
  const isUp = kpi.trend === "up"

  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        isDanger
          ? "border-destructive bg-destructive text-white"
          : "border-border bg-background"
      )}
    >
      <p
        className={cn(
          "text-xs font-medium leading-snug",
          isDanger ? "text-white/90" : "text-muted-foreground"
        )}
      >
        {kpi.label}
      </p>

      <div className="mt-3 flex flex-col gap-1">
        <p
          className={cn(
            "text-xl font-semibold tracking-tight xl:text-2xl",
            isDanger ? "text-white" : "text-foreground"
          )}
        >
          {formatTicketCount(kpi.value)}
        </p>

        <div
          className={cn(
            "flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs font-medium",
            isDanger
              ? "text-white/90"
              : isUp
                ? "text-emerald-600"
                : "text-destructive"
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
            className={cn("shrink-0", isDanger && "brightness-0 invert")}
            aria-hidden
          />
          <span>
            {isUp ? "+" : "-"}
            {kpi.changePercent}%
          </span>
          <span
            className={cn(
              "font-normal",
              isDanger ? "text-white/80" : "text-muted-foreground"
            )}
          >
            vs last month
          </span>
        </div>
      </div>
    </div>
  )
}

export function TicketSummaryCards({
  kpis,
  isLoading = false,
}: TicketSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <SummaryCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi) => (
        <SummaryCard key={kpi.key} kpi={kpi} />
      ))}
    </div>
  )
}
