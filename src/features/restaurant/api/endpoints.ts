const menuManagementBase = "/admin/menu-management"

export const restaurantServerEndpoints = {
  menuItems: `${menuManagementBase}/items`,
  menuItem: (itemId: string | number) => `${menuManagementBase}/items/${itemId}`,
  menuItemAvailability: (itemId: string | number) =>
    `${menuManagementBase}/items/${itemId}/availability`,
} as const

export const restaurantEndpoints = {
  kitchens: "/api/proxy/admin/menu-management/kitchens",
  kitchen: (kitchenId: string) =>
    `/api/proxy/admin/menu-management/kitchens/${kitchenId}`,
  hubs: "/api/menu/hubs",
  groupedMenuItems: "/api/proxy/admin/menu-management/items/grouped",
  menuItems: "/api/proxy/admin/menu-management/items",
  menuItem: (itemId: string | number) =>
    `/api/proxy/admin/menu-management/items/${itemId}`,
  menuItemAvailability: (itemId: string | number) =>
    `/api/proxy/admin/menu-management/items/${itemId}/availability`,
  fulfillmentBranches: "/api/proxy/admin/fulfillment-branches",
} as const
