"use client"

import { Marker, Polyline } from "@react-google-maps/api"

import { Map, type LatLng } from "@/components/maps/map"

type OrderMapProps = {
  kitchen: LatLng
  customer: LatLng
  height?: string
  className?: string
}

function getMapCenter(kitchen: LatLng, customer: LatLng): LatLng {
  return {
    lat: (kitchen.lat + customer.lat) / 2,
    lng: (kitchen.lng + customer.lng) / 2,
  }
}

export function OrderMap({
  kitchen,
  customer,
  height = "400px",
  className,
}: OrderMapProps) {
  return (
    <Map center={getMapCenter(kitchen, customer)} height={height} zoom={13} className={className}>
      <Marker position={kitchen} label="K" />
      <Marker position={customer} label="C" />
      <Polyline path={[kitchen, customer]} />
    </Map>
  )
}
