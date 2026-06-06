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

export function mapApiMenuItemToMenuDetailItem(item: ApiMenuItem): MenuDetailItem {
  const rating = getTagValue(item, "display_rating")

  return {
    id: String(item.id),
    hub: item.kitchen.name,
    name: item.name,
    description: item.description ?? "",
    imageUrl: item.image ?? "",
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
    imageUrl: item.image ?? "",
    enabled: item.is_available,
    isPopular: item.is_popular,
  }
}
