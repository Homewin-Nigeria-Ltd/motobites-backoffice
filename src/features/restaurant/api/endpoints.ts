const menuManagementBase = "/admin/menu-management"

export const restaurantServerEndpoints = {
  menuItems: `${menuManagementBase}/items`,
  menuItem: (itemId: string | number) => `${menuManagementBase}/items/${itemId}`,
  menuItemAvailability: (itemId: string | number) =>
    `${menuManagementBase}/items/${itemId}/availability`,
  menuItemImage: (itemId: string | number, imageId: string | number) =>
    `${menuManagementBase}/items/${itemId}/images/${imageId}`,
  menuItemVideo: (itemId: string | number, videoId: string | number) =>
    `${menuManagementBase}/items/${itemId}/videos/${videoId}`,
  fulfillmentBranches: "/admin/fulfillment-branches",
  fulfillmentBranch: (branchId: string | number) =>
    `/admin/fulfillment-branches/${encodeURIComponent(String(branchId))}`,
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
  menuItemImage: (itemId: string | number, imageId: string | number) =>
    `/api/proxy/admin/menu-management/items/${itemId}/images/${imageId}`,
  menuItemVideo: (itemId: string | number, videoId: string | number) =>
    `/api/proxy/admin/menu-management/items/${itemId}/videos/${videoId}`,
  fulfillmentBranches: "/api/proxy/admin/fulfillment-branches",
  fulfillmentBranch: (branchId: string | number) =>
    `/api/proxy/admin/fulfillment-branches/${encodeURIComponent(String(branchId))}`,
} as const
