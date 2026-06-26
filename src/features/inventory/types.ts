export type InventoryStockLevel = "high" | "medium" | "low"

export type InventoryCategory =
  | "food_stuff"
  | "utensils"
  | "accessories"
  | string

export type InventoryLevelMeta = {
  value: InventoryStockLevel | string
  label: string
  color: string
}

export type InventoryPurchasedBy = {
  id: number
  name: string
  avatar_url: string | null
}

export type InventoryItemUi = {
  inventory_badge: string
  inventory_code: string
  amount: string
  date_purchased: string
}

export type ApiInventoryItem = {
  id: number
  inventory_code: string
  name: string
  description: string | null
  image: string | null
  image_url: string | null
  quantity: number
  amount: number
  amount_formatted: string
  category: InventoryCategory
  category_label: string
  stock_level: InventoryStockLevel | string
  stock_level_label: string
  level: InventoryLevelMeta
  purchased_by: InventoryPurchasedBy
  purchased_at: string
  purchased_at_iso: string
  date_purchased: string
  ui?: InventoryItemUi
}

export type InventoryStockBucket = {
  count: number
  percent: number
}

export type InventoryStockSummary = {
  total_active: number
  high: InventoryStockBucket
  medium: InventoryStockBucket
  low: InventoryStockBucket
}

export type InventoryOverviewResponse = {
  success?: boolean
  data: {
    stock_summary: InventoryStockSummary
    recent: ApiInventoryItem[]
  }
}

export type InventoryListParams = {
  page?: number
  per_page?: number
  search?: string
  category?: string
  stock_level?: string
}

export type InventoryListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type InventoryListResponse = {
  success?: boolean
  data: ApiInventoryItem[]
  meta: InventoryListMeta
}

export type CreateInventoryItemResponse = {
  success?: boolean
  data?: ApiInventoryItem
  message?: string
}

export type CreateInventoryItemInput = {
  name: string
  description?: string
  quantity: number
  amount: number
  category: string
  stock_level: InventoryStockLevel
  image?: File | null
}

export type InventoryActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }
