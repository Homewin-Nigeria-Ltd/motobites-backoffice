"use client"

import {
  GoogleMap as GoogleMapView,
  useJsApiLoader,
} from "@react-google-maps/api"
import type { ReactNode } from "react"

import { AppLoader } from "@/components/ui/app-loader"
import { cn } from "@/lib/utils"

export type LatLng = {
  lat: number
  lng: number
}

type MapProps = {
  center: LatLng
  height?: string
  fill?: boolean
  zoom?: number
  className?: string
  children?: ReactNode
}

export function Map({
  center,
  height = "500px",
  fill = false,
  zoom = 12,
  className,
  children,
}: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const resolvedHeight = fill ? "100%" : height
  const containerClassName = cn(
    fill
      ? "flex h-full min-h-0 items-center justify-center"
      : "flex items-center justify-center",
    "rounded-xl border border-border bg-muted px-4 text-center text-sm text-muted-foreground",
    className
  )
  const mapWrapperClassName = cn(
    "overflow-hidden rounded-xl border border-border",
    fill && "h-full min-h-0",
    className
  )

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey ?? "",
  })

  if (!apiKey) {
    return (
      <div className={containerClassName} style={fill ? undefined : { height }}>
        Map unavailable — set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.
      </div>
    )
  }

  if (loadError) {
    return (
      <div className={containerClassName} style={fill ? undefined : { height }}>
        Failed to load Google Maps.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div
        className={cn(
          fill
            ? "flex h-full min-h-0 items-center justify-center rounded-xl border border-border bg-muted"
            : "flex items-center justify-center rounded-xl border border-border bg-muted",
          className
        )}
        style={fill ? undefined : { height }}
      >
        <AppLoader />
      </div>
    )
  }

  return (
    <div className={mapWrapperClassName}>
      <GoogleMapView
        mapContainerStyle={{ width: "100%", height: resolvedHeight }}
        center={center}
        zoom={zoom}
      >
        {children}
      </GoogleMapView>
    </div>
  )
}
