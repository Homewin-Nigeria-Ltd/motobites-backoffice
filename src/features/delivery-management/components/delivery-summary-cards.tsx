"use client"

import Image from "next/image"

import type { DeliverySummaryKpi } from "../types"
import { formatDeliveryCount } from "../utils/format"
import { ASSETS } from "@/constants/assets"
import { cn } from "@/lib/utils"

const illustrationMap = {
  ongoing_delivery: ASSETS.illustrations.deliveryVan,
  total_delivery: ASSETS.illustrations.orders,
  active_riders: ASSETS.illustrations.activeRider,
} as const

type DeliverySummaryCardsProps = {
  kpis: DeliverySummaryKpi[]
  isLoading?: boolean
}

function getKpiIllustration(key: string) {
  return (
    illustrationMap[key as keyof typeof illustrationMap] ??
    ASSETS.illustrations.deliveryVan
  )
}

function formatKpiValue(kpi: DeliverySummaryKpi) {
  if (typeof kpi.formatted_value === "number") {
    return formatDeliveryCount(kpi.formatted_value)
  }

  return kpi.formatted_value
}

function SummaryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-10 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-10 w-[5.6875rem] animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

function SummaryCard({ kpi }: { kpi: DeliverySummaryKpi }) {
  const hasTrend = kpi.change_percent !== undefined && kpi.trend !== undefined
  const isUp = kpi.trend === "up"

  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <Image
              src={getKpiIllustration(kpi.key)}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0"
              aria-hidden
            />
            <p className="text-sm font-medium text-muted-foreground">
              {kpi.label}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-1">
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              {formatKpiValue(kpi)}
            </p>

            {hasTrend ? (
              <div className="pb-0.5">
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
                  <span>
                    {isUp ? "+" : "-"}
                    {Math.abs(kpi.change_percent ?? 0)}%
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <Image
          src={ASSETS.illustrations.longUpTrend}
          alt=""
          width={91}
          height={40}
          className={cn(
            "h-10 w-auto shrink-0 self-center object-contain",
            hasTrend && !isUp && "rotate-180"
          )}
          aria-hidden
        />
      </div>
    </div>
  )
}

export function DeliverySummaryCards({
  kpis,
  isLoading = false,
}: DeliverySummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SummaryCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {kpis.map((kpi) => (
        <SummaryCard key={kpi.key} kpi={kpi} />
      ))}
    </div>
  )
}
