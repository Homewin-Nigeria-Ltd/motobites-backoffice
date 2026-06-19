"use client"

import type { DeliveryZoneCoverage } from "../types"
import { DeliveryZoneCoverageMap } from "./delivery-zone-coverage-map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DeliveryZoneCoverageCardProps = {
  coverage: DeliveryZoneCoverage
  isLoading?: boolean
}

export function DeliveryZoneCoverageCard({
  coverage,
  isLoading = false,
}: DeliveryZoneCoverageCardProps) {
  if (isLoading) {
    return (
      <Card className="h-full gap-4 py-5">
        <CardHeader className="px-5 pb-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Delivery Zone Coverage
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="h-[280px] animate-pulse rounded-xl bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full gap-4 py-5">
      <CardHeader className="px-5 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Delivery Zone Coverage
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <DeliveryZoneCoverageMap coverage={coverage} />
      </CardContent>
    </Card>
  )
}
