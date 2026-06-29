import type { ApiGiftcard, Giftcard } from "../types"

export function mapApiGiftcardToGiftcard(api: ApiGiftcard): Giftcard {
  return {
    id: String(api.id),
    themeName: api.theme_name,
    name: api.name,
    title: api.title,
    category: api.category,
    categoryLabel: api.category_label,
    amount: api.amount,
    amountFormatted: api.amount_formatted,
    imagePath: api.image_path,
    imageUrl: api.image_url,
    isActive: api.is_active,
    status: api.status,
    statusLabel: api.status_label,
  }
}
