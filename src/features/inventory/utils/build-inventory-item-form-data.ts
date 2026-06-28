import type { CreateInventoryItemInput } from "../types"

export function buildInventoryItemFormData({
  name,
  description,
  quantity,
  amount,
  category,
  stock_level,
  image,
}: CreateInventoryItemInput) {
  const formData = new FormData()

  formData.append("name", name.trim())
  formData.append("quantity", String(quantity))
  formData.append("amount", String(amount))
  formData.append("category", category)
  formData.append("stock_level", stock_level)

  if (description?.trim()) {
    formData.append("description", description.trim())
  }

  if (image) {
    formData.append("image", image)
  }

  return formData
}
