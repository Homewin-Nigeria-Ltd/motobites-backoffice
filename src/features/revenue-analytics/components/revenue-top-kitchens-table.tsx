import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RevenueTopKitchen } from "@/features/revenue-analytics/types"
import { formatDashboardCount } from "@/features/dashboard/utils/format"
import { getInitials } from "@/utils/get-initials"

type RevenueTopKitchensTableProps = {
  kitchens: RevenueTopKitchen[]
}

function formatKitchenAmount(kitchen: RevenueTopKitchen) {
  if (kitchen.formatted_revenue) {
    return kitchen.formatted_revenue
  }

  if (kitchen.revenue_kobo !== undefined) {
    return formatDashboardCount(kitchen.revenue_kobo / 100)
  }

  return "—"
}

function getKitchenOrders(kitchen: RevenueTopKitchen) {
  return kitchen.orders_count
}

export function RevenueTopKitchensTable({
  kitchens,
}: RevenueTopKitchensTableProps) {
  return (
    <Card className="flex h-full flex-col gap-4 py-5">
      <CardHeader className="shrink-0 px-5 pb-0">
        <CardTitle className="text-sm font-semibold text-foreground">
          Top Performing Kitchen
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Based on Amount generated
        </p>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-hidden px-5 pb-5">
        {kitchens.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No kitchen data for this period.
          </p>
        ) : (
          <div className="-mx-5 h-full overflow-auto overscroll-contain px-5 [-webkit-overflow-scrolling:touch] sm:mx-0 sm:px-0">
            <table className="w-full min-w-xl text-left text-sm">
              <thead className="sticky top-0 z-10 bg-card">
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 pr-4 text-xs font-medium tracking-wide uppercase">
                    S/N
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium tracking-wide uppercase">
                    Name of Kitchen
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium tracking-wide uppercase">
                    No. of Orders
                  </th>
                  <th className="pb-3 text-xs font-medium tracking-wide uppercase">
                    Amount Generated
                  </th>
                </tr>
              </thead>
              <tbody>
                {kitchens.map((kitchen) => (
                  <tr
                    key={kitchen.kitchen_id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-4 pr-4 font-semibold text-foreground">
                      {kitchen.serial}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex min-w-[12rem] items-center gap-3">
                        <Avatar className="size-9 shrink-0">
                          <AvatarImage
                            src={kitchen.image_url ?? undefined}
                            alt={kitchen.name}
                          />
                          <AvatarFallback className="bg-secondary text-xs text-primary">
                            {getInitials(kitchen.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold whitespace-nowrap text-foreground">
                          {kitchen.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 font-semibold whitespace-nowrap text-foreground">
                      {formatDashboardCount(getKitchenOrders(kitchen))}
                    </td>
                    <td className="py-4 font-semibold whitespace-nowrap text-foreground">
                      {formatKitchenAmount(kitchen)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
