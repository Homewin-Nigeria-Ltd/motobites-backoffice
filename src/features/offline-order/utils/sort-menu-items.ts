import type {
  ApiSalesDashboardMenuItem,
  OfflineOrderSort,
} from "../types"

export function sortSalesDashboardMenuItems(
  items: ApiSalesDashboardMenuItem[],
  sort: OfflineOrderSort,
) {
  const sortedItems = [...items]

  switch (sort) {
    case "price_asc":
      return sortedItems.sort((left, right) => left.price - right.price)
    case "price_desc":
      return sortedItems.sort((left, right) => right.price - left.price)
    case "name":
      return sortedItems.sort((left, right) =>
        left.name.localeCompare(right.name),
      )
    case "latest":
    default:
      return sortedItems.sort((left, right) => right.id - left.id)
  }
}
