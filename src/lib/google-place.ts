export type GooglePlaceDetails = {
  address: string
  latitude: number
  longitude: number
  locality: string | null
}

const LOCALITY_TYPES = [
  "locality",
  "sublocality",
  "sublocality_level_1",
  "administrative_area_level_2",
  "neighborhood",
] as const

function extractLocality(
  components: google.maps.GeocoderAddressComponent[],
): string | null {
  for (const type of LOCALITY_TYPES) {
    const component = components.find((entry) => entry.types.includes(type))

    if (component?.long_name) {
      return component.long_name
    }
  }

  return null
}

export function parseGooglePlaceDetails(
  place: google.maps.places.PlaceResult | null | undefined,
  fallbackAddress: string,
): GooglePlaceDetails | null {
  const latitude = place?.geometry?.location?.lat()
  const longitude = place?.geometry?.location?.lng()

  if (
    latitude === undefined ||
    longitude === undefined ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null
  }

  return {
    address: place?.formatted_address?.trim() || fallbackAddress,
    latitude,
    longitude,
    locality: extractLocality(place?.address_components ?? []),
  }
}
