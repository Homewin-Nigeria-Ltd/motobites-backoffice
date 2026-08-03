"use client"

import type { DashboardMarketingData } from "@/features/dashboard/types"
import { normalizeAcquisitionSources } from "@/features/dashboard/utils/acquisition-source"
import { formatDashboardCount } from "@/features/dashboard/utils/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DashboardMarketingDataCardProps = {
  marketingData: DashboardMarketingData
}

export function DashboardMarketingDataCard({
  marketingData,
}: DashboardMarketingDataCardProps) {
  const sources = normalizeAcquisitionSources(
    marketingData.acquisition_sources ?? {},
  )
  const totalAcquired = marketingData.total_acquired
  const maxCount = Math.max(...sources.map((source) => source.count), 1)

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="px-5 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Marketing Data
        </CardTitle>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
          {formatDashboardCount(totalAcquired)}{" "}
          <span className="text-lg font-medium text-muted-foreground">
            Acquired
          </span>
        </p>
      </CardHeader>
      <CardContent className="space-y-4 px-5">
        {sources.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">
            No acquisition sources for this period.
          </p>
        ) : (
          sources.map((source) => {
            const width = Math.max((source.count / maxCount) * 100, 4)

            return (
              <div key={source.source} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <p className="font-medium text-foreground">{source.label}</p>
                  <p className="text-muted-foreground">
                    {formatDashboardCount(source.count)}
                    {source.percentage !== undefined
                      ? ` · ${source.percentage}%`
                      : ""}
                  </p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
