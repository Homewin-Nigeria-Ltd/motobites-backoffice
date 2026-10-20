"use client"

import { useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"

import { referralColumns } from "@/features/customers/columns/referral-columns"
import { ReferralsSummaryCards } from "@/features/customers/components/referrals-summary-cards"
import { ReferralsToolbar } from "@/features/customers/components/referrals-toolbar"
import { useReferrals } from "@/features/customers/hooks/use-referrals"
import type { ReferralPeriod } from "@/features/customers/types"
import { buildReferralDateParams } from "@/features/customers/utils/referral-period"
import { mapReferralPlatformStats } from "@/features/customers/utils/referral"
import { DataTable } from "@/components/data-table"

const DEFAULT_PAGE_SIZE = 8

export function ReferralsSection() {
  const [period, setPeriod] = useState<ReferralPeriod>("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [page, setPage] = useState(1)

  const dateParams = useMemo(
    () => buildReferralDateParams(period, dateRange),
    [period, dateRange]
  )
  const isCustomPeriodReady = period !== "custom" || Boolean(dateRange?.from)

  const { data, isPending, isFetching } = useReferrals(
    {
      page,
      per_page: DEFAULT_PAGE_SIZE,
      from: dateParams.from,
      to: dateParams.to,
    },
    { enabled: isCustomPeriodReady }
  )

  const items = data?.items ?? []
  const totalPages = data?.meta.last_page ?? 1
  const currentPage = data?.meta.current_page ?? page

  const handlePeriodChange = (nextPeriod: ReferralPeriod) => {
    setPeriod(nextPeriod)
    setPage(1)

    if (nextPeriod !== "custom") {
      setDateRange(undefined)
    }
  }

  const handleDateRangeChange = (next: DateRange | undefined) => {
    setDateRange(next)
    setPage(1)
  }

  const platformStats = data?.meta ?? mapReferralPlatformStats()

  return (
    <div className="flex flex-col gap-4 bg-muted p-4 md:gap-6 md:p-6">
      <ReferralsSummaryCards stats={platformStats} />
      <DataTable
        columns={referralColumns}
        data={isCustomPeriodReady ? items : []}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={
          isCustomPeriodReady &&
          (isPending || (isFetching && items.length === 0))
        }
        toolbar={
          <ReferralsToolbar
            total={
              isCustomPeriodReady
                ? (data?.meta.totalReferralsCount ?? data?.meta.total ?? 0)
                : 0
            }
            period={period}
            dateRange={dateRange}
            onPeriodChange={handlePeriodChange}
            onDateRangeChange={handleDateRangeChange}
          />
        }
      />
    </div>
  )
}
