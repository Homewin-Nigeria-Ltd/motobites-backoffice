"use client"

import Image from "next/image"

import { useRiderStatusCount } from "../hooks/use-rider-status-count"
import type { RiderOverviewStatus } from "../types"
import { ASSETS } from "@/constants/assets"
import { cn } from "@/lib/utils"

const overviewCards: Array<{
  status: RiderOverviewStatus
  label: string
  illustration: string
  iconBg: string
}> = [
  {
    status: "active",
    label: "Active Riders",
    illustration: ASSETS.illustrations.activeRider,
    iconBg: "bg-muted",
  },
  {
    status: "in_transit",
    label: "Riders Intransit",
    illustration: ASSETS.illustrations.riderInTransit,
    iconBg: "bg-sky-50",
  },
  {
    status: "away",
    label: "Away Riders",
    illustration: ASSETS.illustrations.awayRider,
    iconBg: "bg-amber-50",
  },
  {
    status: "offline",
    label: "Offline Riders",
    illustration: ASSETS.illustrations.offlineRider,
    iconBg: "bg-orange-50",
  },
]

function RiderSummaryCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-5">
      <div className="flex animate-pulse items-center gap-3">
        <div className="size-10 shrink-0 rounded-full bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>
      <div className="mt-4 h-8 w-12 animate-pulse rounded bg-muted" />
    </div>
  )
}

function SummaryCard({
  label,
  value,
  illustration,
  iconBg,
}: {
  label: string
  value: number
  illustration: string
  iconBg: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            iconBg
          )}
        >
          <Image
            src={illustration}
            alt=""
            width={28}
            height={28}
            className="size-7 object-contain"
            aria-hidden
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>

      <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  )
}

function RiderStatusCard({
  status,
  label,
  illustration,
  iconBg,
}: {
  status: RiderOverviewStatus
  label: string
  illustration: string
  iconBg: string
}) {
  const { data, isPending, isError, error } = useRiderStatusCount(status)

  if (isError) {
    throw error
  }

  if (isPending) {
    return <RiderSummaryCardSkeleton />
  }

  return (
    <SummaryCard
      label={label}
      value={data.meta.total}
      illustration={illustration}
      iconBg={iconBg}
    />
  )
}

export function RiderSummaryCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {overviewCards.map((card) => (
        <RiderStatusCard
          key={card.status}
          status={card.status}
          label={card.label}
          illustration={card.illustration}
          iconBg={card.iconBg}
        />
      ))}
    </div>
  )
}
