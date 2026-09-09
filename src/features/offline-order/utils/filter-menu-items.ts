import type { ApiSalesDashboardMenuItem } from "../types"

export function filterSalesDashboardMenuItems(
  items: ApiSalesDashboardMenuItem[],
  search?: string,
) {
  const query = search?.trim().toLowerCase()

  if (!query) {
    return items
  }

  return items.filter((item) => {
    if (item.name.toLowerCase().includes(query)) {
      return true
    }

    if (item.description?.toLowerCase().includes(query)) {
      return true
    }

    return item.tags?.some((tag) => tag.toLowerCase().includes(query)) ?? false
  })
}
