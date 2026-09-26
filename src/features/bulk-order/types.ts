export type BulkOrderSource = "corporate_bulk"

export type BulkOrderItemKind = "portion" | "side"

export type BulkOrderAllocationRole =
  | "primary"
  | "combo"
  | "side"
  | "protein"
  | "drink"

export type BulkOrderAddon = {
  id: number
  menuItemId: number
  name: string
  price: number
  groupName: string
  allocationRole?: BulkOrderAllocationRole
}

export type BulkOrderAddonGroup = {
  name: string
  options: BulkOrderAddon[]
}

export type BulkOrderLineType = "primary" | "side" | "protein" | "drink"

export type BulkOrderCartItem = {
  itemId: string
  menuItemId: number
  name: string
  basePrice: number
  price: number
  image: string | null
  kitchenId: string
  kitchenName: string
  categoryId: string
  categoryName: string
  quantity: number
  kind: BulkOrderItemKind
  lineType: BulkOrderLineType
  allocationRole: BulkOrderAllocationRole
  addons: BulkOrderAddon[]
}

export type BulkOrderCatalogItem = {
  id: string
  menuItemId: number
  name: string
  price: number
  image: string | null
  kitchenId: string
  kitchenName: string
  categoryId: string
  categoryName: string
  kind: BulkOrderItemKind
  lineType: BulkOrderLineType
  allocationRole: BulkOrderAllocationRole
  addonGroups: BulkOrderAddonGroup[]
}

export type BulkOrderItemsParams = {
  search?: string
  kitchen_id?: number
}

export type BulkOrderListParams = {
  search?: string
  per_page?: number
  page?: number
  fulfillment_branch_id?: number | null
}

export type CreateBulkOrderAddonPayload = {
  id: number
  quantity: number
  allocation_role?: BulkOrderAllocationRole
}

export type CreateBulkOrderItemPayload = {
  menu_item_id: number
  quantity: number
  allocation_role: BulkOrderAllocationRole
  type?: BulkOrderAllocationRole
  addons?: CreateBulkOrderAddonPayload[]
  add_ons?: CreateBulkOrderAddonPayload[]
  add_on_ids?: number[]
}

export type CreateBulkOrderPayload = {
  items: CreateBulkOrderItemPayload[]
  customer_name?: string
  customer_phone?: string
  payment_method: string
  order_source: BulkOrderSource | string
  source?: BulkOrderSource
  fulfillment_branch_id?: number | null
  branch_id?: number | null
  notes?: string
  promo_code?: string
  coupon_code?: string
}

export type SaveBulkOrderPayload = CreateBulkOrderPayload

export type ApiBulkOrderAllocation = {
  valid?: boolean
  allocation_valid?: boolean
  portion_count?: number
  side_count?: number
  protein_count?: number
  drink_count?: number
  message?: string
  allocation_message?: string
}

export type ApiBulkOrderPreview = {
  subtotal?: number
  subtotal_kobo?: number
  discount?: number
  discount_kobo?: number
  discount_amount?: number
  discount_amount_kobo?: number
  discount_percentage?: number
  service_fee?: number
  service_fee_kobo?: number
  tax?: number
  tax_kobo?: number
  service_tax?: number
  service_tax_kobo?: number
  bulk_service_tax?: number
  total?: number
  total_kobo?: number
  total_amount?: number
  promo_code?: string | null
  allocation?: ApiBulkOrderAllocation
  allocation_valid?: boolean
  portion_count?: number
  side_count?: number
  allocation_message?: string
}

export type ApiBulkOrderPreviewResponse = {
  success: boolean
  data: ApiBulkOrderPreview
  message?: string
}

export type BulkOrderPreviewTotals = {
  subtotal: number
  discount: number
  discountPercentage: number
  serviceFee: number
  total: number
  allocationValid?: boolean
  allocationMessage?: string
  portionCount?: number
  sideCount?: number
}

export type BulkOrderCategory = {
  id: string
  label: string
}

export type BulkOrderCatalogGroup = {
  id: string
  title: string
  items: BulkOrderCatalogItem[]
}
