"use client"

import { Icons } from "@/components/ui/icons"
import type { ProductCategoryPerformance } from "@/features/dashboard/types"
import {
  formatDashboardCount,
  formatDashboardKobo,
} from "@/features/dashboard/utils/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type DashboardCategoryPerformanceCardProps = {
  categories: ProductCategoryPerformance[]
}

export function DashboardCategoryPerformanceCard({
  categories,
}: DashboardCategoryPerformanceCardProps) {
  return (
    <Card className="flex flex-col gap-4 py-5">
      <CardHeader className="shrink-0 px-5 pb-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icons.layers size={16} />
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-foreground">
                Product Category Performance
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Sales volume, revenue contribution, and average order value
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {categories.length} Categor{categories.length === 1 ? "y" : "ies"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 px-5">
        {categories.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No category sales recorded for this period.
          </p>
        ) : (
          <div className="space-y-4">
            {categories.map((item) => {
              const isGrowthPositive = item.growth_percent >= 0

              return (
                <div
                  key={item.category}
                  className="rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-border"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {item.category}
                        </p>
                        <div
                          className={cn(
                            "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
                            isGrowthPositive
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                              : "bg-destructive/10 text-destructive"
                          )}
                        >
                          {isGrowthPositive ? (
                            <Icons.arrowUpRight size={12} />
                          ) : (
                            <Icons.arrowDownRight size={12} />
                          )}
                          <span>{Math.abs(item.growth_percent)}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDashboardCount(item.units)} unit
                        {item.units === 1 ? "" : "s"} sold • AOV:{" "}
                        <span className="font-medium text-foreground">
                          {formatDashboardKobo(item.aov_kobo)}
                        </span>
                      </p>
                    </div>


                    <div className="text-left sm:text-right">
                      <p className="text-base font-bold text-foreground">
                        {formatDashboardKobo(item.sales_kobo)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.contribution_percent}% of menu sales
                      </p>
                    </div>
                  </div>

                  {/* Contribution bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.max(0, item.contribution_percent))}%`,
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {item.contribution_percent}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
