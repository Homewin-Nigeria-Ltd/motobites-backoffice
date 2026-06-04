export function getNotificationActionHref(target: string) {
  if (target === "menu_management") return "/menu"
  if (target === "order_management") return "/order/pending"
  if (target === "restaurant_management") return "/kitchen"
  return "/dashboard"
}

export function getNotificationInitials(categoryLabel: string) {
  return categoryLabel
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
