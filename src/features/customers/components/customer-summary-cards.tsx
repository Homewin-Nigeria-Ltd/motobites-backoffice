"use client"

import Image from "next/image"

import type { CustomerSummaryStat } from "@/features/customers/types"
import { formatCustomerCount } from "@/features/customers/utils/customer-format"
import { ASSETS } from "@/constants/assets"
import { cn } from "@/lib/utils"

type CustomerSummaryCardsProps = {
  stats: CustomerSummaryStat[]
  isLoading?: boolean
}

function SummaryCard({ stat }: { stat: CustomerSummaryStat }) {
  const isUp = stat.trend === "up"

  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-2xl font-semibold leading-none tracking-tight text-foreground">
              {formatCustomerCount(stat.value)}
            </p>
            <div
              className={cn(
                "flex items-center gap-1 text-base font-medium",
                isUp ? "text-emerald-600" : "text-destructive"
              )}
            >
              <Image
                src={ASSETS.illustrations.shortUpTrend}
                alt=""
                width={13}
                height={8}
                className={cn("shrink-0", !isUp && "rotate-180")}
                aria-hidden
              />
              <span>+{stat.changePercent}%</span>
            </div>
          </div>
        </div>

        <Image
          src={ASSETS.illustrations.longUpTrend}
          alt=""
          width={91}
          height={40}
          className={cn(
            "h-10 w-auto shrink-0 object-contain",
            !isUp && "rotate-180"
          )}
          aria-hidden
        />
      </div>
    </div>
  )
}

function SummaryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="flex items-center gap-2">
            <div className="h-7 w-28 animate-pulse rounded bg-muted" />
            <div className="h-4 w-14 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="h-10 w-[5.6875rem] animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

export function CustomerSummaryCards({
  stats,
  isLoading = false,
}: CustomerSummaryCardsProps) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
        isLoading && "opacity-80"
      )}
    >
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <SummaryCardSkeleton key={index} />
          ))
        : stats.map((stat) => <SummaryCard key={stat.key} stat={stat} />)}
    </div>
  )
}
