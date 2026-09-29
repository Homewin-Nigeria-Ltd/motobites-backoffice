import type { BulkOrderSource } from "./types"

export const BULK_ORDER_CART_STORAGE_KEY = "motobites:bulk-order:cart"
export const BULK_ORDER_SOURCE_STORAGE_KEY = "motobites:bulk-order:source"
export const BULK_ORDER_CHECKOUT_STORAGE_KEY = "motobites:bulk-order:checkout"
export const BULK_ORDER_RECEIPT_STORAGE_KEY = "motobites:bulk-order:receipt"
export const BULK_ORDER_ACTIVE_SAVED_ID_KEY =
  "motobites:bulk-order:active-saved-id"

export const ALL_BULK_ORDER_CATEGORY_ID = "all"
export const ALL_BULK_ORDER_KITCHEN_ID = "all"

export const BULK_ORDER_SOURCE_OPTIONS = [
  { value: "corporate_bulk", label: "Corporate / Bulk Request" },
] as const satisfies ReadonlyArray<{
  value: BulkOrderSource
  label: string
}>

export const DEFAULT_BULK_ORDER_SOURCE: BulkOrderSource = "corporate_bulk"

export const BULK_ORDER_SERVICE_TAX_RATE = 0.05
