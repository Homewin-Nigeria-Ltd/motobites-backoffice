"use client"

import { DeliveryOrderFrequencyCard } from "../components/delivery-order-frequency-card"
import { DeliverySummaryCards } from "../components/delivery-summary-cards"
import { DeliveryZoneCoverageCard } from "../components/delivery-zone-coverage-card"
import {
  DELIVERY_ORDER_FREQUENCY,
  DELIVERY_SUMMARY_KPIS,
  DELIVERY_ZONE_LOCATIONS,
} from "../data/delivery.dummy"
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
          <>
            <DeliverySummaryCards kpis={DELIVERY_SUMMARY_KPIS} />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <DeliveryOrderFrequencyCard
                orderFrequency={DELIVERY_ORDER_FREQUENCY}
              />
              <DeliveryZoneCoverageCard locations={DELIVERY_ZONE_LOCATIONS} />
            </div>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Order List
              </h2>
              {ordersContent}
            </section>
          </>
        )}
      </div>
    </div>
  )
}
