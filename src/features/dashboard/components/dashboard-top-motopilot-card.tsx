import type { DashboardOverviewData } from "@/features/dashboard/types"
import { formatDashboardCount } from "@/features/dashboard/utils/format"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getInitials } from "@/utils/get-initials"

type DashboardTopMotopilotCardProps = {
  topMotopilots: DashboardOverviewData["top_motopilots"]
}

export function DashboardTopMotopilotCard({
  topMotopilots,
}: DashboardTopMotopilotCardProps) {
  return (
    <Card className="flex h-full flex-col gap-4 py-5">
      <CardHeader className="shrink-0 px-5 pb-0">
        <CardTitle className="text-sm font-semibold text-foreground">
          Top MotoPilot
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Based on number of completed orders
        </p>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5">
        {topMotopilots.riders.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No rider data for this period.
          </p>
        ) : (
          <ul className="space-y-4">
            {topMotopilots.riders.map((rider) => (
              <li key={rider.rider_id} className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {rider.serial}
                </span>
                <Avatar className="size-10 shrink-0">
                  <AvatarFallback className="bg-secondary text-xs text-primary">
                    {getInitials(rider.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {rider.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {rider.zone}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted-foreground">Total Rides</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatDashboardCount(rider.total_rides)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
