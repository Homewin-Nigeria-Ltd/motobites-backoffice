"use client"

import { DeliveryOrderFrequencyCard } from "../components/delivery-order-frequency-card"
import { DeliverySummaryCards } from "../components/delivery-summary-cards"
import { DeliveryZoneCoverageCard } from "../components/delivery-zone-coverage-card"
import { useDeliveryDashboard } from "../hooks/use-delivery-dashboard"
import type { DeliveryTab } from "../types"

const SIMPLE_ORDER_LIST_TABS = new Set<DeliveryTab>([
  "unassigned",
  "ongoing",
  "completed",
])

type DeliveryManagementSectionProps = {
  tab: DeliveryTab
  ordersContent?: React.ReactNode
}

function DeliveryOverviewDashboard({
  ordersContent,
}: {
  ordersContent?: React.ReactNode
}) {
  const { data, isPending, isError, error } = useDeliveryDashboard()

  return (
    <>
      {isError ? (
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load delivery overview."}
        </div>
      ) : (
        <>
          <DeliverySummaryCards
            kpis={data?.summaryKpis ?? []}
            isLoading={isPending}
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <DeliveryOrderFrequencyCard
              orderFrequency={
                data?.orderFrequency ?? { total_orders: 0, series: [] }
              }
              isLoading={isPending}
            />
            <DeliveryZoneCoverageCard
              coverage={
                data?.zoneCoverage ?? {
                  center: { lat: 6.5244, lng: 3.3792 },
                  summary: {
                    active_zones: 0,
                    orders_with_coordinates: 0,
                    covered_orders: 0,
                    uncovered_orders: 0,
                    coverage_rate: 0,
                    live_riders: 0,
                    covered_riders: 0,
                    uncovered_riders: 0,
                    location_ttl_minutes: 0,
                  },
                  zones: [],
                  orders: [],
                  riders: [],
                  uncovered_orders: [],
                  uncovered_riders: [],
                }
              }
              isLoading={isPending}
            />
          </div>
        </>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Order List</h2>
        {ordersContent}
      </section>
    </>
  )
}

export function DeliveryManagementSection({
  tab,
  ordersContent,
}: DeliveryManagementSectionProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-8 overflow-y-auto p-4 md:p-6">
        {SIMPLE_ORDER_LIST_TABS.has(tab) ? (
          ordersContent
        ) : (
          <DeliveryOverviewDashboard ordersContent={ordersContent} />
        )}
      </div>
    </div>
  )
}
