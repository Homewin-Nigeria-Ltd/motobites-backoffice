import { toImageSrc } from "@/lib/image-url"

export function formatRiderGender(gender: string | null | undefined) {
  if (!gender) return "—"

  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
}

export function formatRiderDateOfBirth(dateOfBirth: string | null | undefined) {
  if (!dateOfBirth) return "—"

  const date = new Date(dateOfBirth.slice(0, 10))

  if (Number.isNaN(date.getTime())) {
    return dateOfBirth
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function formatRiderDisplayValue(value: string | null | undefined) {
  if (!value?.trim()) return "—"
  return value
}

export function splitGuarantorName(name: string | null | undefined) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean)

  return {
    firstName: parts[0] ?? "—",
    lastName: parts.slice(1).join(" ") || "—",
  }
}

export function getDocumentFileName(url: string | null | undefined) {
  if (!url) return null

  const fileName = url.split("/").pop()?.split("?")[0]
  return fileName ?? "Document"
}

export function getDocumentUrl(url: string | null | undefined) {
  if (!url) return null
  return toImageSrc(url)
}

export function formatDocumentDate(isoDate: string | null | undefined) {
  if (!isoDate) return null

  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
