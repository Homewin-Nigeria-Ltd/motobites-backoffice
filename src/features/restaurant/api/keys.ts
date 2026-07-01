import type {
  KitchenMenuItemsParams,
  MenuGroupedItemsParams,
} from "./queries"

export const restaurantKeys = {
  all: ["restaurants"] as const,
  menuItems: ["restaurants", "menu-items"] as const,
  lists: () => [...restaurantKeys.all, "list"] as const,
  hubs: () => [...restaurantKeys.all, "hubs"] as const,
  detail: (id: string) => [...restaurantKeys.all, "detail", id] as const,
  groupedMenuItems: (params: MenuGroupedItemsParams) =>
    [...restaurantKeys.menuItems, "grouped", params] as const,
  kitchenMenuItems: (params: KitchenMenuItemsParams) =>
    [...restaurantKeys.menuItems, "kitchen", params] as const,
  menuItemDetail: (itemId: string) =>
    [...restaurantKeys.menuItems, "detail", itemId] as const,
  branches: () => [...restaurantKeys.all, "branches"] as const,
} as const
