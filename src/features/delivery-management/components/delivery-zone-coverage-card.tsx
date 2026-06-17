"use client"

import { Marker } from "@react-google-maps/api"

import { Map, type LatLng } from "@/components/maps/map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const LAGOS_CENTER: LatLng = { lat: 6.5244, lng: 3.3792 }

type DeliveryZoneLocation = {
  id: string
  name: string
  latitude: number
  longitude: number
}

type DeliveryZoneCoverageCardProps = {
  locations: DeliveryZoneLocation[]
}

export function DeliveryZoneCoverageCard({
  locations,
}: DeliveryZoneCoverageCardProps) {
  return (
    <Card className="h-full gap-4 py-5">
      <CardHeader className="px-5 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Delivery Zone Coverage
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="overflow-hidden rounded-xl border border-border">
          <Map center={LAGOS_CENTER} zoom={11} height="280px" fill>
            {locations.map((location) => (
              <Marker
                key={location.id}
                position={{
                  lat: location.latitude,
                  lng: location.longitude,
                }}
                title={location.name}
              />
            ))}
          </Map>
        </div>
      </CardContent>
    </Card>
  )
}
