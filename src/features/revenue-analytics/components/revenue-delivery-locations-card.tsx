import type { RevenueDeliveryLocation } from "@/features/revenue-analytics/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type RevenueDeliveryLocationsCardProps = {
  deliveryLocations: {
    total_deliveries: number
    locations: RevenueDeliveryLocation[]
  }
}

const mapMarkerPositions: Record<string, string> = {
  ikoyi: "left-[18%] top-[28%]",
  vi: "left-[24%] top-[42%]",
  cms: "left-[32%] top-[36%]",
  lekki: "left-[48%] top-[34%]",
  ajah: "left-[62%] top-[48%]",
  awoyaya: "left-[72%] top-[58%]",
  yaba: "left-[36%] top-[52%]",
  surulere: "left-[28%] top-[58%]",
  shomolu: "left-[22%] top-[48%]",
}

function LocationMarker({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "absolute flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-[10px] font-medium text-foreground shadow-sm",
        className
      )}
    >
      <span className="size-2 rounded-full bg-primary" />
      {label}
    </div>
  )
}

export function RevenueDeliveryLocationsCard({
  deliveryLocations,
}: RevenueDeliveryLocationsCardProps) {
  const activeLocations = deliveryLocations.locations.filter(
    (location) => location.percent > 0 || location.count > 0
  )

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="px-5 pb-0">
        <CardTitle className="text-sm font-semibold text-foreground">
          Order Delivery Location
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Based on Amount generated
        </p>
      </CardHeader>
      <CardContent className="grid gap-6 px-5 lg:grid-cols-2">
        <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-[#F3F4F6]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.65),rgba(243,244,246,0.2))]" />
          {activeLocations.map((location) => (
            <LocationMarker
              key={location.key}
              label={location.label}
              className={
                mapMarkerPositions[location.key] ?? "left-1/2 top-1/2 -translate-x-1/2"
              }
            />
          ))}
          {activeLocations.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              No delivery locations for this period.
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          {deliveryLocations.locations.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No location data for this period.
            </p>
          ) : (
            deliveryLocations.locations.map((location) => (
              <div key={location.key} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-foreground">
                    {location.label}
                  </span>
                  <span className="font-semibold text-foreground">
                    {location.percent}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(location.percent, 100)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
