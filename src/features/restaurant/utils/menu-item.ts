import type { Menu, MenuDetailItem } from "@/features/restaurant/types"
import type { ApiMenuItem, ApiMenuItemTags } from "@/features/restaurant/types"

function getTagValue(item: ApiMenuItem, key: keyof ApiMenuItemTags): number {
  const tags = item.tags
  if (!tags || Array.isArray(tags)) {
    return 0
  }

  const value = tags[key]
  return typeof value === "number" ? value : 0
}

export function getMenuItemImageUrl(
  item?: Partial<ApiMenuItem> | null
): string | null {
  if (!item) return null

  // 1. Check images array
  if (Array.isArray(item.images) && item.images.length > 0) {
    const validImages = item.images.filter(Boolean)
    // Sort by sort_order ascending if available
    const sorted = [...validImages].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    )
    for (const img of sorted) {
      if (typeof img === "string" && (img as string).trim()) {
        return (img as string).trim()
      }
      if (typeof img === "object") {
        const url = img.image_url || img.image_path
        if (typeof url === "string" && url.trim()) {
          return url.trim()
        }
      }
    }
  }

  // 2. Check item.image_url
  if (typeof item.image_url === "string" && item.image_url.trim()) {
    return item.image_url.trim()
  }

  // 3. Check item.image
  if (typeof item.image === "string" && item.image.trim()) {
    return item.image.trim()
  }

  // 4. In case item.image is an object with image_url / image_path
  if (typeof item.image === "object" && item.image !== null) {
    const imgObj = item.image as Record<string, unknown>
    const url = imgObj.image_url || imgObj.image_path || imgObj.url
    if (typeof url === "string" && url.trim()) {
      return url.trim()
    }
  }

  return null
}

export function mapApiMenuItemToMenuDetailItem(item: ApiMenuItem): MenuDetailItem {
  const rating = getTagValue(item, "display_rating")

  return {
    id: String(item.id),
    hub: item.kitchen?.name ?? "",
    name: item.name,
    description: item.description ?? "",
    imageUrl: getMenuItemImageUrl(item) ?? "",
    rating: rating > 0 ? Math.min(5, Math.round(rating)) : 0,
    itemsSold: 0,
    reviewCount: getTagValue(item, "display_review_count"),
    itemErrors: 0,
    isPopular: item.is_popular,
  }
}

export function mapApiMenuItemToMenu(item: ApiMenuItem): Menu {
  return {
    id: String(item.id),
    name: item.name,
    description: item.description ?? "",
    price: item.price,
    durationMinutes: item.preparation_time_minutes,
    imageUrl: getMenuItemImageUrl(item) ?? "",
    enabled: item.is_available,
    isPopular: item.is_popular,
  }
}
