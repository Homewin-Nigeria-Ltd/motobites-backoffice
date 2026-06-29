import type { ApiGiftcard } from "../types"
import type { GiftcardFormValues } from "../schemas/giftcard-form.schema"

export function mapApiGiftcardToFormValues(
  giftcard: ApiGiftcard
): GiftcardFormValues {
  return {
    themeName: giftcard.theme_name,
    name: giftcard.name,
    title: giftcard.title,
    category: giftcard.category,
    amount: giftcard.amount,
    isActive: giftcard.is_active,
  }
}
