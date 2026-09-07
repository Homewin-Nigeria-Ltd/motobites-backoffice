import { mealPlaceholderImage } from "./placeholder-image"

export function toImageSrc(url: string | null | undefined): string {
  if (!url || url.trim() === "") {
    return mealPlaceholderImage
  }

  const trimmed = url.trim()
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed
  }

  return `https://${trimmed}`
}
