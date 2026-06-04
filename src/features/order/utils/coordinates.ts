import type { LatLng } from "@/components/maps/map"

type OrderMapCoords = {
  delivery_lat: string
  delivery_lng: string
  kitchen_lat: string
  kitchen_lng: string
}

/** Default fallback near Ikoyi, Lagos */
const IKOYI_DEFAULT: LatLng = {
  lat: 6.4541,
  lng: 3.4316,
}

function parseCoordinate(value: string | null | undefined) {
  if (value == null || value === "") {
    return null
  }

  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

function toLatLngWithFallback(
  lat: number | null,
  lng: number | null,
  fallback: LatLng = IKOYI_DEFAULT
): LatLng {
  if (lat == null || lng == null) {
    return fallback
  }

  return { lat, lng }
}

export function getOrderMapCoordinates(map: OrderMapCoords | null | undefined) {
  if (!map) {
    return {
      kitchen: IKOYI_DEFAULT,
      customer: IKOYI_DEFAULT,
    }
  }

  const kitchenLat = parseCoordinate(map.kitchen_lat)
  const kitchenLng = parseCoordinate(map.kitchen_lng)
  const deliveryLat = parseCoordinate(map.delivery_lat)
  const deliveryLng = parseCoordinate(map.delivery_lng)

  return {
    kitchen: toLatLngWithFallback(kitchenLat, kitchenLng),
    customer: toLatLngWithFallback(deliveryLat, deliveryLng),
  }
}
