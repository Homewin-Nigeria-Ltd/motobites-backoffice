const inventoryPath = "/admin/inventory-management"

export const inventoryServerEndpoints = {
  items: `${inventoryPath}/items`,
  item: (id: string | number) =>
    `${inventoryPath}/items/${encodeURIComponent(String(id))}`,
  overview: `${inventoryPath}/overview`,
} as const

export const inventoryEndpoints = {
  overview: `/api/proxy${inventoryPath}/overview`,
  items: `/api/proxy${inventoryPath}/items`,
  item: (id: string | number) =>
    `/api/proxy${inventoryPath}/items/${encodeURIComponent(String(id))}`,
} as const
