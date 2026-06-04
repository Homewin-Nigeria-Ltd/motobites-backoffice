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
  zoom?: number
  className?: string
  children?: ReactNode
}

export function Map({
  center,
  height = "500px",
  zoom = 12,
  className,
  children,
}: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey ?? "",
  })

  if (!apiKey) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border border-border bg-muted px-4 text-center text-sm text-muted-foreground",
          className
        )}
        style={{ height }}
      >
        Map unavailable — set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.
      </div>
    )
  }

  if (loadError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border border-border bg-muted px-4 text-center text-sm text-muted-foreground",
          className
        )}
        style={{ height }}
      >
        Failed to load Google Maps.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border border-border bg-muted",
          className
        )}
        style={{ height }}
      >
        <AppLoader />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border",
        className
      )}
    >
      <GoogleMapView
        mapContainerStyle={{ width: "100%", height }}
        center={center}
        zoom={zoom}
      >
        {children}
      </GoogleMapView>
    </div>
  )
}
