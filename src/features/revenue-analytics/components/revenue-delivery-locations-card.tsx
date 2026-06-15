"use client"

import { useMemo, useState } from "react"
import { InfoWindow, Marker } from "@react-google-maps/api"

import { Map, type LatLng } from "@/components/maps/map"
import type { RevenueDeliveryLocation } from "@/features/revenue-analytics/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const LAGOS_CENTER: LatLng = { lat: 6.5244, lng: 3.3792 }

type RevenueDeliveryLocationsCardProps = {
  deliveryLocations: {
    total_deliveries: number
    locations: RevenueDeliveryLocation[]
  }
}

function hasCoordinates(location: RevenueDeliveryLocation) {
  return (
    Number.isFinite(location.latitude) && Number.isFinite(location.longitude)
  )
}

function getMapViewport(locations: RevenueDeliveryLocation[]): {
  center: LatLng
  zoom: number
} {
  const points = locations.filter(hasCoordinates)

  if (points.length === 0) {
    return { center: LAGOS_CENTER, zoom: 11 }
  }

  if (points.length === 1) {
    return {
      center: { lat: points[0].latitude, lng: points[0].longitude },
      zoom: 13,
    }
  }

  const latitudes = points.map((point) => point.latitude)
  const longitudes = points.map((point) => point.longitude)
  const minLat = Math.min(...latitudes)
  const maxLat = Math.max(...latitudes)
  const minLng = Math.min(...longitudes)
  const maxLng = Math.max(...longitudes)
  const span = Math.max(maxLat - minLat, maxLng - minLng)

  let zoom = 11
  if (span < 0.04) zoom = 13
  else if (span < 0.08) zoom = 12
  else if (span < 0.16) zoom = 11
  else zoom = 10

  return {
    center: {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2,
    },
    zoom,
  }
}

export function RevenueDeliveryLocationsCard({
  deliveryLocations,
}: RevenueDeliveryLocationsCardProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const activeLocations = useMemo(
    () =>
      deliveryLocations.locations.filter(
        (location) =>
          hasCoordinates(location) &&
          (location.percent > 0 || location.count > 0)
      ),
    [deliveryLocations.locations]
  )

  const { center, zoom } = useMemo(
    () =>
      getMapViewport(
        activeLocations.length > 0
          ? activeLocations
          : deliveryLocations.locations
      ),
    [activeLocations, deliveryLocations.locations]
  )

  const selectedLocation = activeLocations.find(
    (location) => location.key === selectedKey
  )

  const hasActiveLocations = activeLocations.length > 0

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
      <CardContent className="grid min-w-0 gap-6 px-4 sm:px-5 lg:grid-cols-2 lg:items-stretch">
        <div className="flex min-h-[280px] flex-col self-stretch">
          {hasActiveLocations ? (
            <Map
              center={center}
              zoom={zoom}
              fill
              className="h-full min-h-[280px] flex-1 rounded-2xl"
            >
              {activeLocations.map((location) => (
                <Marker
                  key={location.key}
                  position={{
                    lat: location.latitude,
                    lng: location.longitude,
                  }}
                  onClick={() => setSelectedKey(location.key)}
                />
              ))}

              {selectedLocation ? (
                <InfoWindow
                  position={{
                    lat: selectedLocation.latitude,
                    lng: selectedLocation.longitude,
                  }}
                  onCloseClick={() => setSelectedKey(null)}
                >
                  <div className="min-w-40 space-y-1 pr-1 text-sm text-foreground">
                    <p className="font-semibold">{selectedLocation.label}</p>
                    <p className="text-muted-foreground">
                      {selectedLocation.count} deliver
                      {selectedLocation.count === 1 ? "y" : "ies"}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedLocation.percent}% of total
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedLocation.latitude.toFixed(4)},{" "}
                      {selectedLocation.longitude.toFixed(4)}
                    </p>
                  </div>
                </InfoWindow>
              ) : null}
            </Map>
          ) : (
            <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-border bg-muted px-4 text-center text-sm text-muted-foreground">
              No delivery locations for this period.
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center space-y-5">
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
                <div className="h-[30px] overflow-hidden rounded bg-muted">
                  <div
                    className="h-full rounded"
                    style={{
                      width: `${Math.min(location.percent, 100)}%`,
                      background:
                        "linear-gradient(7.59deg, #F59600 14.75%, rgba(245, 150, 0, 0) 119.08%)",
                    }}
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
