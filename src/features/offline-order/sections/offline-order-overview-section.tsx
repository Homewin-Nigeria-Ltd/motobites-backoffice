"use client"

import { ClientSuspense } from "@/components/client-suspense"
import { OfflineOrderCreateBanner } from "@/features/offline-order/components/overview/offline-order-create-banner"
import { OfflineOrderCreateOrderSection } from "@/features/offline-order/components/overview/offline-order-create-order-section"
import { OfflineOrderOverviewActivitySection } from "@/features/offline-order/components/overview/offline-order-overview-activity-section"
import { OfflineOrderOverviewCompletedSection } from "@/features/offline-order/components/overview/offline-order-overview-completed-section"
import { OfflineOrderOverviewSavedSection } from "@/features/offline-order/components/overview/offline-order-overview-saved-section"
import {
  OverviewActivitySkeleton,
  OverviewOrderListSkeleton,
  OverviewStaffSkeleton,
  OverviewStatsSkeleton,
  OverviewTransactionsSkeleton,
} from "@/features/offline-order/components/overview/offline-order-overview-skeletons"
import { OfflineOrderOverviewStaffSection } from "@/features/offline-order/components/overview/offline-order-overview-staff-section"
import { OfflineOrderOverviewOperationalReportsSection } from "@/features/offline-order/components/overview/offline-order-overview-operational-reports-section"
import { OfflineOrderOverviewStatsSection } from "@/features/offline-order/components/overview/offline-order-overview-stats-section"
import { OfflineOrderOverviewTransactionsSection } from "@/features/offline-order/components/overview/offline-order-overview-transactions-section"

export function OfflineOrderOverviewSection() {
  return (
    <div className="bg-muted">
      <div className="space-y-6 p-4 md:p-6">
        <OfflineOrderCreateBanner />

        <ClientSuspense fallback={<OverviewStatsSkeleton />}>
          <OfflineOrderOverviewStatsSection />
        </ClientSuspense>

        <OfflineOrderCreateOrderSection />

        <OfflineOrderOverviewOperationalReportsSection />

        <div className="grid gap-4 xl:grid-cols-2">
          <ClientSuspense fallback={<OverviewOrderListSkeleton />}>
            <OfflineOrderOverviewSavedSection />
          </ClientSuspense>
          <ClientSuspense fallback={<OverviewOrderListSkeleton />}>
            <OfflineOrderOverviewCompletedSection />
          </ClientSuspense>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <ClientSuspense fallback={<OverviewStaffSkeleton />}>
            <OfflineOrderOverviewStaffSection />
          </ClientSuspense>
          <ClientSuspense fallback={<OverviewActivitySkeleton />}>
            <OfflineOrderOverviewActivitySection />
          </ClientSuspense>
        </div>

        <ClientSuspense fallback={<OverviewTransactionsSkeleton />}>
          <OfflineOrderOverviewTransactionsSection />
        </ClientSuspense>
      </div>
    </div>
  )
}
