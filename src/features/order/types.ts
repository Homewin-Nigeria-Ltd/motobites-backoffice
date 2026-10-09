export const orderTabs = [
  "pending",
  "processing",
  "transit",
  "completed",
  "rejected",
  "performance",
] as const

export type OrderTab = (typeof orderTabs)[number]

export type ApiOrderKitchen = {
  id: string
  name: string
} | null

export type ApiOrderFulfillmentBranch = {
  id: number
  key: string
  name: string
  address?: string | null
} | null

export type ApiOrderRejectedBy =
  | string
  | {
      id?: number
      name?: string
    }
  | null

export type ApiOrderRejection = {
  reason: string
  rejected_at: string
  rejected_by?: ApiOrderRejectedBy
}

export type ApiOrder = {
  id: string
  order_number: string
  reference_number: string | null
  status: string
  display_status: string
  item_name: string
  item_image: string | null
  customer_name: string
  delivery_address: string
  payment_method: string
  amount_paid: number
  amount_paid_formatted: string
  rider_name: string | null
  kitchen: ApiOrderKitchen
  fulfillment_branch?: ApiOrderFulfillmentBranch
  map: unknown
  created_at: string
  rejection_reason?: string | null
  rejected_at?: string | null
  rejected_by?: ApiOrderRejectedBy
  rejection?: ApiOrderRejection | null
}

export type ApiOrderGroup = {
  kitchen: ApiOrderKitchen
  order_count: number
  orders: ApiOrder[]
}

export type ApiOrderTabCounts = {
  pending: number
  processing: number
  transit: number
  completed: number
  rejected?: number
}

export type OrderTabCountsApiResponse = {
  success: boolean
  data: ApiOrderTabCounts
  message?: string
}

export function isOrderTab(value: string): value is OrderTab {
  return (orderTabs as readonly string[]).includes(value)
}

export function getOrderTabPath(tab: OrderTab) {
  return `/order/${tab}`
}

export type ApiOrderManagementData = {
  tab: Exclude<OrderTab, "performance">
  tab_counts: ApiOrderTabCounts
  groups: ApiOrderGroup[]
}

export type OrdersGroupedApiResponse = {
  success: boolean
  data: ApiOrderManagementData
  message?: string
}

export type OrdersGroupedParams = {
  tab: Exclude<OrderTab, "performance">
  per_page?: number
  page?: number
  search?: string
  fulfillment_branch_id?: number | null
  branch_id?: number | null
}

export type ApiOrderAssignee = {
  id: number
  name: string
} | null

export const orderAssigneeTypes = ["chef", "rider", "support"] as const

export type OrderAssigneeType = (typeof orderAssigneeTypes)[number]

export type ApiOrderAssigneeOption = {
  id: number
  user_id?: number
  name: string
}

export type OrderAssigneesApiResponse = {
  success: boolean
  data: ApiOrderAssigneeOption[]
  message?: string
}

export type ApiOrderItemAddon = {
  id: number | string
  name: string
  type?: string
  price?: number
  quantity?: number
}

export type ApiOrderDetailItem = {
  id: string
  name: string
  quantity: number
  unit_price: number
  subtotal: number
  image?: string | null
  addons?: ApiOrderItemAddon[]
  selected_addons?: ApiOrderItemAddon[]
  modifiers?: ApiOrderItemAddon[]
  selected_modifiers?: ApiOrderItemAddon[]
}

export type ApiOrderPaymentBreakdown = {
  currency?: string
  gross_order_total_kobo?: number
  gross_order_total?: number
  charges?: {
    items_subtotal_kobo?: number
    delivery_fee_kobo?: number
    service_fee_kobo?: number
    rider_tip_kobo?: number
  }
  reductions?: {
    promo_discount_kobo?: number
    scheduled_delivery_discount_kobo?: number
    welcome_bonus_kobo?: number
    cashback_kobo?: number
    reward_wallet_kobo?: number
    refund_credit_kobo?: number
    total_reductions_kobo?: number
  }
  amount_due_kobo?: number
  amount_due?: number
  calculated_amount_due_kobo?: number
  payment?: {
    id?: string
    reference?: string
    channel?: string
    status?: string
    charged_amount_kobo?: number
    charged_amount?: number
    wallet_kobo?: number
    bnpl_kobo?: number
    external_payment_kobo?: number
  }
}

export type ApiOrderReview = {
  comment: string | null
  remark: string | null
  rating: number | null
  author_name: string | null
}

export type ApiOrderDetailData = {
  id: string
  order_number: string
  status: string
  display_status: string
  item: {
    name: string
    image: string | null
    description: string | null
  }
  customer_note: string | null
  customer_name: string
  delivery_address: string
  amount_paid: number
  amount_paid_formatted: string
  payment: {
    method: string
    receipt_available: boolean
  }
  assignments: {
    chef: ApiOrderAssignee
    rider: ApiOrderAssignee
    support: ApiOrderAssignee
  }
  timing: {
    estimated_preparation_minutes: number
    preparation_countdown_seconds: number
    preparation_ready_at: string | null
    pickup_time: string | null
    delivery_countdown_seconds: number | null
    estimated_delivery_at: string | null
    delivered_at: string | null
  }
  confirmation_code: string
  confirmation_code_digits: string[]
  map: {
    delivery_lat: string
    delivery_lng: string
    kitchen_lat: string
    kitchen_lng: string
  }
  reviews: {
    customer: ApiOrderReview | null
    rider: ApiOrderReview | null
  }
  items?: ApiOrderDetailItem[]
  payment_breakdown?: ApiOrderPaymentBreakdown | null
  kitchen: {
    id: string | null
    name: string | null
    vendor_name: string | null
  }
  fulfillment_branch?: ApiOrderFulfillmentBranch
  created_at: string
  rejection_reason?: string | null
  rejected_at?: string | null
  rejected_by?: ApiOrderRejectedBy
  rejection?: ApiOrderRejection | null
}

export type OrderDetailApiResponse = {
  success: boolean
  data: ApiOrderDetailData
  message?: string
}

export type ApiOrderReceiptGatewayAuthorization = {
  last4: string
  card_type: string
  bank: string
  brand: string
  channel: string
  exp_month: string
  exp_year: string
}

export type ApiOrderReceiptGatewayCustomer = {
  email: string
  customer_code: string
}

export type ApiOrderReceiptGatewayResponse = {
  id: number
  status: string
  reference: string
  amount: number
  currency: string
  channel: string
  gateway_response: string
  paid_at: string
  fees: number
  authorization: ApiOrderReceiptGatewayAuthorization
  customer: ApiOrderReceiptGatewayCustomer
}

export type ApiOrderReceiptData = {
  reference: string
  channel: string
  amount_kobo: number
  status: string
  paid_at: string
  gateway_response: ApiOrderReceiptGatewayResponse
}

export type OrderReceiptApiResponse = {
  success: boolean
  data: ApiOrderReceiptData
  message?: string
}
