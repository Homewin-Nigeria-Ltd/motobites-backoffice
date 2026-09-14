"use client"

import { Icons } from "@/components/ui/icons"
import type { OperationalBestSellingProduct } from "@/features/dashboard/types"
import {
  formatDashboardCount,
  formatDashboardKobo,
} from "@/features/dashboard/utils/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type DashboardOperationalBestsellersCardProps = {
  products: OperationalBestSellingProduct[]
}

function getRankBadgeStyle(rank: number) {
  switch (rank) {
    case 1:
      return "bg-amber-500 text-white dark:bg-amber-600 shadow-sm"
    case 2:
      return "bg-slate-400 text-white dark:bg-slate-500"
    case 3:
      return "bg-amber-700 text-white dark:bg-amber-800"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function DashboardOperationalBestsellersCard({
  products,
}: DashboardOperationalBestsellersCardProps) {
  return (
    <Card className="flex flex-col gap-4 py-5">
      <CardHeader className="shrink-0 px-5 pb-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icons.flame size={16} />
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-foreground">
                Best Selling Products
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Top dishes ranked by order quantity and revenue
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {products.length} Item{products.length === 1 ? "" : "s"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 px-5">
        {products.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No product sales recorded for this period.
          </p>
        ) : (
          <div className="space-y-3">
            {products.map((item) => (
              <div
                key={`${item.menu_item_id}-${item.rank}`}
                className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3.5 transition-colors hover:border-border"
              >
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    getRankBadgeStyle(item.rank)
                  )}
                >
                  {item.rank}
                </div>

                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icons.utensilsCrossed size={16} />
                </div>


                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.product}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Unit Price:{" "}
                    <span className="font-medium text-foreground">
                      {formatDashboardKobo(item.unit_price_kobo ?? item.unit_price * 100)}
                    </span>
                    {" • "}
                    <span className="font-medium text-primary">
                      {formatDashboardCount(item.units)} unit{item.units === 1 ? "" : "s"} sold
                    </span>
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-foreground">
                    {formatDashboardKobo(item.sales_kobo ?? item.sales * 100)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Gross Revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
