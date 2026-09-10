"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"

import { DashboardCategoryPerformanceCard } from "@/features/dashboard/components/dashboard-category-performance-card"
import { DashboardCustomerBehaviourCard } from "@/features/dashboard/components/dashboard-customer-behaviour-card"
import { DashboardCustomerInformationCard } from "@/features/dashboard/components/dashboard-customer-information-card"
import { DashboardDailyTrafficCard } from "@/features/dashboard/components/dashboard-daily-traffic-card"
import { DashboardDiscountsRefundsCard } from "@/features/dashboard/components/dashboard-discounts-refunds-card"
import { DashboardInventoryStatusCard } from "@/features/dashboard/components/dashboard-inventory-status-card"
import { DashboardKpiCards } from "@/features/dashboard/components/dashboard-kpi-cards"
import { DashboardMarketingDataCard } from "@/features/dashboard/components/dashboard-marketing-data-card"
import { DashboardOperationalBestsellersCard } from "@/features/dashboard/components/dashboard-operational-bestsellers-card"
import { DashboardOrderAnalyticsCard } from "@/features/dashboard/components/dashboard-order-analytics-card"
import { DashboardOrderFrequencyCard } from "@/features/dashboard/components/dashboard-order-frequency-card"
import { DashboardPaymentPerformanceCard } from "@/features/dashboard/components/dashboard-payment-performance-card"
import { DashboardPeriodFilter } from "@/features/dashboard/components/dashboard-period-filter"
import { DashboardSalesRevenueChart } from "@/features/dashboard/components/dashboard-sales-revenue-chart"
import { DashboardSummaryCards } from "@/features/dashboard/components/dashboard-summary-cards"
import { TotalDeliveriesModal } from "@/features/dashboard/components/total-deliveries-modal"
import { OngoingOrdersModal } from "@/features/dashboard/components/ongoing-orders-modal"
import { TotalRevenueModal } from "@/features/dashboard/components/total-revenue-modal"
import { DashboardTopMotopilotCard } from "@/features/dashboard/components/dashboard-top-motopilot-card"
import { DashboardTopSellingList } from "@/features/dashboard/components/dashboard-top-selling-list"
import { DashboardPeriod } from "@/features/dashboard/enums"
import { useDashboardOperationalReports } from "@/features/dashboard/hooks/use-dashboard-operational-reports"
import { useDashboardOverview } from "@/features/dashboard/hooks/use-dashboard-overview"
import { AppLoader } from "@/components/ui/app-loader"
import { useFilterToast } from "@/hooks/use-filter-toast"
import { cn } from "@/lib/utils"


export function DashboardSection() {
  const [period, setPeriod] = useState(DashboardPeriod.TwentyFourHours)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isTotalDeliveriesModalOpen, setIsTotalDeliveriesModalOpen] =
    useState(false)
  const [isOngoingOrdersModalOpen, setIsOngoingOrdersModalOpen] =
    useState(false)
  const [isTotalRevenueModalOpen, setIsTotalRevenueModalOpen] =
    useState(false)
  const { data, isPending, isFetching, isError, error } = useDashboardOverview(
    period,
    dateRange,
  )
  const { data: operationalData } = useDashboardOperationalReports(
    period,
    dateRange
  )

  useFilterToast({
    isFetching,
    isPending,
    isError,
    error,
    loadingMessage: "Updating overview data...",
    successMessage: "Overview data updated",
    errorMessage: "Failed to load dashboard overview",
  })

  const handlePeriodChange = (next: DashboardPeriod) => {
    setPeriod(next)
    setDateRange(undefined)
  }

  const handleDateRangeChange = (next: DateRange | undefined) => {
    setDateRange(next)
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
        <DashboardPeriodFilter
          value={period}
          onChange={handlePeriodChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load dashboard overview."}
        </div>
      </div>
    )
  }

  if (isPending || !data) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
        <DashboardPeriodFilter
          value={period}
          onChange={handlePeriodChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />
        <AppLoader className="flex-1 py-24" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6",
      )}
    >
      <DashboardPeriodFilter
        value={period}
        onChange={handlePeriodChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />

      {data.kpis?.length ? (
        <DashboardSummaryCards
          kpis={data.kpis}
          onCardClick={(key) => {
            if (key === "total_deliveries") {
              setIsTotalDeliveriesModalOpen(true)
            } else if (key === "ongoing_orders") {
              setIsOngoingOrdersModalOpen(true)
            } else if (key === "total_revenue") {
              setIsTotalRevenueModalOpen(true)
            }
          }}
        />
      ) : null}

      <TotalDeliveriesModal
        open={isTotalDeliveriesModalOpen}
        onOpenChange={setIsTotalDeliveriesModalOpen}
        currentPeriod={period}
        dateRange={dateRange}
      />

      <OngoingOrdersModal
        open={isOngoingOrdersModalOpen}
        onOpenChange={setIsOngoingOrdersModalOpen}
        currentPeriod={period}
        dateRange={dateRange}
      />

      <TotalRevenueModal
        open={isTotalRevenueModalOpen}
        onOpenChange={setIsTotalRevenueModalOpen}
        currentPeriod={period}
        dateRange={dateRange}
      />

      {operationalData?.discounts_promotions_refunds ? (
        <DashboardDiscountsRefundsCard
          data={operationalData.discounts_promotions_refunds}
          salesKobo={operationalData.sales_kobo}
          salesGrowthPercent={operationalData.sales_growth_percent}
        />
      ) : null}

      {operationalData?.payment_performance?.length ? (
        <DashboardPaymentPerformanceCard
          paymentPerformance={operationalData.payment_performance}
        />
      ) : null}

      {operationalData?.product_category_performance?.length ||
      operationalData?.best_selling_products?.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {operationalData.product_category_performance?.length ? (
            <DashboardCategoryPerformanceCard
              categories={operationalData.product_category_performance}
            />
          ) : null}
          {operationalData.best_selling_products?.length ? (
            <DashboardOperationalBestsellersCard
              products={operationalData.best_selling_products}
            />
          ) : null}
        </div>
      ) : null}

      {data.order_analytics ? (
        <DashboardOrderAnalyticsCard orderAnalytics={data.order_analytics} />
      ) : null}


      {data.customer_information ? (
        <DashboardCustomerInformationCard
          customerInformation={data.customer_information}
        />
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {data.customer_behaviour ? (
          <DashboardCustomerBehaviourCard
            customerBehaviour={data.customer_behaviour}
          />
        ) : null}
        {data.marketing_data ? (
          <DashboardMarketingDataCard marketingData={data.marketing_data} />
        ) : null}
      </div>

      {data.order_frequency || data.top_motopilots ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {data.order_frequency ? (
            <div className="xl:col-span-2">
              <DashboardOrderFrequencyCard
                orderFrequency={data.order_frequency}
              />
            </div>
          ) : null}
          {data.top_motopilots ? (
            <DashboardTopMotopilotCard topMotopilots={data.top_motopilots} />
          ) : null}
        </div>
      ) : null}

      {data.sales_revenue ? (
        <DashboardSalesRevenueChart salesRevenue={data.sales_revenue} />
      ) : null}

      {data.daily_traffic || data.inventory_status ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {data.daily_traffic ? (
            <DashboardDailyTrafficCard dailyTraffic={data.daily_traffic} />
          ) : null}
          {data.inventory_status ? (
            <DashboardInventoryStatusCard
              inventoryStatus={data.inventory_status}
            />
          ) : null}
        </div>
      ) : null}

      {data.top_selling ? (
        <div className="grid gap-4 xl:grid-cols-3">
          <DashboardTopSellingList
            title="Top Selling Combos"
            items={data.top_selling.combos}
          />
          <DashboardTopSellingList
            title="Top Selling Items"
            items={data.top_selling.items}
          />
          <DashboardTopSellingList
            title="Top Selling Kitchen"
            items={data.top_selling.kitchens}
          />
        </div>
      ) : null}

      {data.performance_metrics?.length ? (
        <DashboardKpiCards metrics={data.performance_metrics} />
      ) : null}
    </div>
  )
}
