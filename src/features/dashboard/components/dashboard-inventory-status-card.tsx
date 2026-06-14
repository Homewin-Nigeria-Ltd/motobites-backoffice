import type { DashboardInventoryItem } from "@/features/dashboard/types"
import { Icons } from "@/components/ui/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type DashboardInventoryStatusCardProps = {
  inventoryStatus: {
    items: DashboardInventoryItem[]
  }
}

const statusStyles: Record<
  "low_stock" | "out_of_stock" | "in_stock",
  { badge: string; icon: string }
> = {
  low_stock: {
    badge: "bg-[#FFF6E5] text-[#C98A00]",
    icon: "bg-[#F5A623]",
  },
  out_of_stock: {
    badge: "bg-[#FEECEC] text-[#E71D36]",
    icon: "bg-[#E71D36]",
  },
  in_stock: {
    badge: "bg-emerald-50 text-emerald-700",
    icon: "bg-emerald-600",
  },
}

function getStatusStyle(status: string) {
  if (status in statusStyles) {
    return statusStyles[status as keyof typeof statusStyles]
  }

  return statusStyles.in_stock
}

function InventoryStatusBadge({ item }: { item: DashboardInventoryItem }) {
  const styles = getStatusStyle(item.status)

  return (
    <span
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full px-3 text-xs font-medium",
        styles.badge
      )}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-full text-white",
          styles.icon
        )}
      >
        {item.status === "out_of_stock" ? (
          <Icons.close size={10} strokeWidth={3} />
        ) : item.status === "low_stock" ? (
          <span className="text-[10px] leading-none font-bold">!</span>
        ) : (
          <Icons.check size={10} strokeWidth={3} />
        )}
      </span>
      {item.status_label}
    </span>
  )
}

export function DashboardInventoryStatusCard({
  inventoryStatus,
}: DashboardInventoryStatusCardProps) {
  return (
    <Card className="flex h-80 flex-col gap-4 py-5">
      <CardHeader className="shrink-0 px-5 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Inventory Status
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-hidden px-5 pb-5">
        {inventoryStatus.items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No inventory data for this period.
          </p>
        ) : (
          <div className="-mx-5 h-full overflow-auto overscroll-contain px-5 [-webkit-overflow-scrolling:touch] sm:mx-0 sm:px-0">
            <table className="w-full min-w-xl text-left text-sm">
              <thead className="sticky top-0 z-10 bg-card">
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 pr-4 text-xs font-medium tracking-wide uppercase">
                    Items
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium tracking-wide uppercase">
                    Status
                  </th>
                  <th className="pb-3 text-xs font-medium tracking-wide uppercase">
                    Last Restock
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventoryStatus.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-4 pr-4 font-semibold whitespace-nowrap text-foreground">
                      {item.name}
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <InventoryStatusBadge item={item} />
                    </td>
                    <td className="py-4 font-semibold whitespace-nowrap text-foreground">
                      {item.last_restock_at}
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
