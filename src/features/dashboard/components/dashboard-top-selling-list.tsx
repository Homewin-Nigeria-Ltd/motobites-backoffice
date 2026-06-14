import type { DashboardTopSellingEntry } from "@/features/dashboard/types"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getInitials } from "@/utils/get-initials"

type DashboardTopSellingListProps = {
  title: string
  items: DashboardTopSellingEntry[]
}

export function DashboardTopSellingList({
  title,
  items,
}: DashboardTopSellingListProps) {
  return (
    <Card className="flex h-80 flex-col gap-4 py-5">
      <CardHeader className="shrink-0 px-5 pb-0">
        <CardTitle className="text-sm font-medium text-foreground">
          {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          number on Income generated
        </p>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5">
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No data for this period.
          </p>
        ) : (
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li key={`${item.name}-${index}`} className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <Avatar className="size-10 shrink-0">
                  <AvatarFallback className="bg-secondary text-xs text-primary">
                    {getInitials(item.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Revenue generated
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-foreground">
                  {item.formatted_revenue}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
