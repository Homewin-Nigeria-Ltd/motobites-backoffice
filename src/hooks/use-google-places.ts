"use client"

import { useJsApiLoader } from "@react-google-maps/api"
import { useEffect, useRef } from "react"

const LOADER_ID = "motobites-google-maps"

export type GooglePlaceOption = {
  placeId: string
  label: string
}

export function useGooglePlaces() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""
  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(
    null
  )
  const placesRef = useRef<google.maps.places.PlacesService | null>(null)
  const placesContainerRef = useRef<HTMLDivElement | null>(null)

  const { isLoaded } = useJsApiLoader({
    id: LOADER_ID,
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  })

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    autocompleteRef.current = new google.maps.places.AutocompleteService()

    if (!placesContainerRef.current) {
      placesContainerRef.current = document.createElement("div")
    }

    placesRef.current = new google.maps.places.PlacesService(
      placesContainerRef.current
    )
  }, [isLoaded])

  return {
    hasApiKey: Boolean(apiKey),
    isLoaded,
    autocompleteRef,
    placesRef,
  }
}
