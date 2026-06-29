import type { GiftcardFormInput } from "../types"

export function buildGiftcardFormData({
  themeName,
  name,
  title,
  category,
  amount,
  isActive,
  image,
  imageUrl,
}: GiftcardFormInput) {
  const formData = new FormData()

  formData.append("theme_name", themeName.trim())
  formData.append("name", name.trim())
  formData.append("title", title.trim())
  formData.append("category", category)
  formData.append("amount", String(amount))
  formData.append("is_active", isActive ? "true" : "false")

  if (image) {
    formData.append("image", image)
  } else if (imageUrl?.trim()) {
    formData.append("image_url", imageUrl.trim())
  }

  return formData
}
