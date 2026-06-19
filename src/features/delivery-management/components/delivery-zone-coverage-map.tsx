"use client"

import { useMemo, useState } from "react"
import { InfoWindow, Marker } from "@react-google-maps/api"

import type { DeliveryZone, DeliveryZoneCoverage } from "../types"
import { Map, type LatLng } from "@/components/maps/map"

const LAGOS_CENTER: LatLng = { lat: 6.5244, lng: 3.3792 }
const MAP_HEIGHT = "280px"

function hasCenter(zone: DeliveryZone) {
  return (
    Number.isFinite(zone.center.lat) && Number.isFinite(zone.center.lng)
  )
}

function getMapViewport(zones: DeliveryZone[]): {
  center: LatLng
  zoom: number
} {
  const points = zones.filter(hasCenter)

  if (points.length === 0) {
    return { center: LAGOS_CENTER, zoom: 11 }
  }

  if (points.length === 1) {
    return {
      center: { lat: points[0].center.lat, lng: points[0].center.lng },
      zoom: 13,
    }
  }

  const latitudes = points.map((zone) => zone.center.lat)
  const longitudes = points.map((zone) => zone.center.lng)
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

type DeliveryZoneCoverageMapProps = {
  coverage: DeliveryZoneCoverage
}

export function DeliveryZoneCoverageMap({
  coverage,
}: DeliveryZoneCoverageMapProps) {
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null)

  const zones = useMemo(
    () => coverage.zones.filter(hasCenter),
    [coverage.zones]
  )

  const { center, zoom } = useMemo(() => getMapViewport(zones), [zones])

  const selectedZone = zones.find((zone) => zone.id === selectedZoneId)

  if (zones.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-border bg-muted px-4 text-center text-sm text-muted-foreground"
        style={{ height: MAP_HEIGHT }}
      >
        No delivery zones to display.
      </div>
    )
  }

  return (
    <Map center={center} zoom={zoom} height={MAP_HEIGHT} className="rounded-xl">
      {zones.map((zone) => (
        <Marker
          key={zone.id}
          position={{ lat: zone.center.lat, lng: zone.center.lng }}
          onClick={() => setSelectedZoneId(zone.id)}
        />
      ))}

      {selectedZone ? (
        <InfoWindow
          position={{
            lat: selectedZone.center.lat,
            lng: selectedZone.center.lng,
          }}
          onCloseClick={() => setSelectedZoneId(null)}
        >
          <div className="min-w-36 space-y-1 pr-1 text-sm text-foreground">
            <p className="font-semibold">{selectedZone.name}</p>
            <p className="text-xs text-muted-foreground">
              {selectedZone.stats.order_count} orders
            </p>
          </div>
        </InfoWindow>
      ) : null}
    </Map>
  )
}
