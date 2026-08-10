import type { GooglePlaceDetails } from "@/lib/google-place"

function slugifyBranchKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function toTitleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

function extractLocalityFromAddress(address: string): string {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean)

  if (parts.length >= 2) {
    return parts[parts.length - 2] ?? ""
  }

  return parts[0] ?? ""
}

export function deriveBranchFieldsFromPlace(details: GooglePlaceDetails) {
  const locality =
    details.locality?.trim() || extractLocalityFromAddress(details.address)
  const key = locality ? slugifyBranchKey(locality) : ""
  const name = locality ? `${toTitleCase(locality)} Branch` : ""

  return {
    key,
    name,
    address: details.address,
    latitude: details.latitude,
    longitude: details.longitude,
  }
}
