export type OfferTab = "all" | "active" | "inactive" | "expired"

export type OfferStatus = "active" | "inactive" | "paused" | "expired"

export type Offer = {
  id: string
  title: string
  description: string
  status: OfferStatus
  promoCode: string
  detailsLabel: string
  restrictionLabel: string
  startDate: string
  endDate: string
  statusLabel: string
  usageCount: number
}

export type OfferListParams = {
  tab?: OfferTab
  fulfillment_branch_id?: number | null
}

export type ApiOffer = {
  id: number
  name: string
  title: string
  promotion_name: string
  description: string
  promotion_description: string
  promo_code: string
  code: string
  promotion_code: string
  discount_type: string
  discount_value: number
  details: string
  detail: string
  details_label: string
  applies_to: string
  restriction: string
  restriction_label: string
  kitchen_id: number | null
  kitchen_name: string | null
  start_date: string
  end_date: string
  promo_start: string
  promo_end: string
  is_active: boolean
  is_paused?: boolean | null
  status: string
  status_label: string
  max_uses_per_customer?: number | null
  is_reusable?: boolean | string | number | null
  minimum_order_value?: number | null
  discount_cap?: number | null
  eligibility_type?: string | null
  eligible_group_ids?: number[] | null
  eligible_customer_ids?: number[] | null
  eligible_users?: number[] | string[] | string | null
  selected_customers?: string[] | null
  customer_groups?: string[] | null
  max_uses?: number | null
  total_uses?: number | null
  remaining_uses?: number | null
  usage_count?: number | null
  confirmed_usage_count?: number | null
  reserved_usage_count?: number | null
  min_order_kobo?: number | null
  discount_cap_kobo?: number | null
  times_used?: number | null
  customers_redeemed?: number | null
  total_discounts_given?: number | null
  total_discounts_given_kobo?: number | null
}

export type ApiOfferUsageTracking = {
  total_uses?: number | null
  confirmed_uses?: number | null
  reserved_uses?: number | null
  remaining_uses?: number | null
  unique_customers_redeemed?: number | null
  total_discounts_given_kobo?: number | null
  redeemed_customers?: unknown[] | null
}

export type ApiOffersResponse = {
  success: boolean
  data: ApiOffer[]
}

export type ApiPromotionInsightRevenue = {
  value_kobo: number
  value: number
  formatted: string
  change_percent: number
  trend: "up" | "down"
  status_label: string
  total_sales: number
}

export type ApiPromotionInsightCheckouts = {
  value: number
  change_percent: number
  trend: "up" | "down"
  weekly_buckets: Array<{
    week_label: string
    count: number
  }>
}

export type ApiPromotionInsightCustomerAcquisition = {
  new_users: number
  change_percent: number
  trend: "up" | "down"
  distribution: Array<{
    range: string
    count: number
  }>
}

export type ApiPromotionInsight = {
  revenue_generated: ApiPromotionInsightRevenue
  checkouts: ApiPromotionInsightCheckouts
  customer_acquisition: ApiPromotionInsightCustomerAcquisition
}

export type ApiUserInsight = {
  id?: number
  user_id?: string | number
  name: string
  email: string
  status: string
  status_label?: string
  item_ordered?: string
  phone_number?: string
  amount_spent?: string | number
  amount_spent_formatted?: string
  promocode_frequently?: number
  promo_code_usage_count?: number
}

export type ApiOfferDetailData = {
  offer: ApiOffer
  promotion_insight: ApiPromotionInsight
  user_insight: ApiUserInsight[]
  usage_tracking?: ApiOfferUsageTracking | null
}

export type ApiOfferDetailResponse = {
  success: boolean
  data: ApiOfferDetailData
}

export type PromotionInsightRevenue = {
  formatted: string
  changePercent: number
  trend: "up" | "down"
  statusLabel: string
  totalSales: number
}

export type PromotionInsightCheckouts = {
  value: number
  changePercent: number
  trend: "up" | "down"
  weeklyBuckets: Array<{
    weekLabel: string
    count: number
  }>
}

export type PromotionInsightCustomerAcquisition = {
  newUsers: number
  changePercent: number
  trend: "up" | "down"
  distribution: Array<{
    range: string
    count: number
  }>
}

export type PromotionInsight = {
  revenueGenerated: PromotionInsightRevenue
  checkouts: PromotionInsightCheckouts
  customerAcquisition: PromotionInsightCustomerAcquisition
}

export type UserInsightRow = {
  id: string
  userId: string
  name: string
  email: string
  initials: string
  status: string
  statusLabel: string
  itemOrdered: string
  phoneNumber: string
  amountSpent: string
  promoCodeUsage: number
}

export type OfferDetail = {
  offer: Offer
  promotionInsight: PromotionInsight
  userInsight: UserInsightRow[]
  usageTracking: OfferUsageTracking
}

export type OfferInput = {
  name: string
  promotion_name: string
  description: string
  promotion_description: string
  promo_code: string
  promotion_code: string
  discount_type: string
  discount_value: number
  details: string
  detail: string
  applies_to: "subtotal"
  restriction: string
  kitchen_id: number | null
  start_date: string
  end_date: string
  promo_start: string
  promo_end: string
  status: "active" | "inactive" | "paused"
  is_active: boolean
  max_uses_per_customer: number
  is_reusable: boolean
  max_uses: number | null
  min_order_kobo: number
  minimum_order_value: number
  discount_cap_kobo: number | null
  discount_cap: number | null
  eligibility_type: string
  eligible_customer_ids: number[]
  eligible_group_ids: number[]
}

export type ApiCustomerGroupCustomer = {
  id: number
  name?: string | null
  full_name?: string | null
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  phone?: string | null
}

export type ApiCustomerGroup = {
  id: number
  name: string
  description?: string | null
  customer_ids?: number[] | null
  customers?: ApiCustomerGroupCustomer[] | null
  customers_count?: number | null
  members_count?: number | null
  created_at?: string | null
  updated_at?: string | null
}

export type ApiCustomerGroupResponse = {
  success: boolean
  data: ApiCustomerGroup
}

export type ApiCustomerGroupsResponse = {
  success: boolean
  data: ApiCustomerGroup[]
}

export type CustomerGroupMember = {
  id: string
  label: string
}

export type CustomerGroup = {
  id: string
  name: string
  description: string
  customerIds: number[]
  customers: CustomerGroupMember[]
  membersCount: number
}

export type CustomerGroupInput = {
  name: string
  description?: string
  customer_ids?: number[]
}

export type UpdateCustomerGroupInput = {
  groupId: string
  input: CustomerGroupInput
}

export type OfferUsageTracking = {
  timesUsed: number
  customersRedeemed: number
  totalDiscountGiven: number
  remainingUses: number | null
  confirmedUses?: number
  reservedUses?: number
}

export type CreateOfferInput = OfferInput

export type UpdateOfferInput = {
  offerId: string
  input: OfferInput
}

export type PromotionActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }

export type GiftcardCategory = "birthday" | "friendship" | "love" | string

export type Giftcard = {
  id: string
  themeName: string
  name: string
  title: string
  category: GiftcardCategory
  categoryLabel: string
  amount: number
  amountFormatted: string
  imagePath: string
  imageUrl: string
  isActive: boolean
  status: string
  statusLabel: string
}

export type ApiGiftcard = {
  id: number
  theme_name: string
  name: string
  title: string
  category: string
  category_label: string
  amount: number
  amount_formatted: string
  image_path: string
  image_url: string
  is_active: boolean
  status: string
  status_label: string
}

export type ApiGiftcardsResponse = {
  success: boolean
  data: ApiGiftcard[]
}

export type GiftcardFormInput = {
  themeName: string
  name: string
  title: string
  category: string
  amount: number
  isActive: boolean
  image?: File | null
  imageUrl?: string | null
}

export type UpdateGiftcardInput = {
  giftcardId: string
  input: GiftcardFormInput
}

export type SpecialGiftOffer = {
  id: string
  name: string
  minimumBasketValue: number
  giftMenuItemId: string
  giftMenuItemName: string
  giftQuantity: number
  startsAt: string
  endsAt: string
  isActive: boolean
  status: string
  statusLabel: string
}

export type ApiSpecialGiftOffer = {
  id: number
  name?: string | null
  minimum_basket_value?: number | null
  gift_menu_item_id?: number | null
  gift_menu_item?: {
    id?: number | null
    name?: string | null
  } | null
  gift_quantity?: number | null
  starts_at?: string | null
  ends_at?: string | null
  is_active?: boolean | null
  status?: string | null
  status_label?: string | null
}

export type ApiSpecialGiftOffersResponse = {
  success: boolean
  data: ApiSpecialGiftOffer[]
}

export type ApiSpecialGiftOfferResponse = {
  success: boolean
  data: ApiSpecialGiftOffer
}

export type SpecialGiftOfferInput = {
  name: string
  minimum_basket_value: number
  gift_menu_item_id: number
  gift_quantity: number
  starts_at: string
  ends_at: string
  is_active: boolean
}

export type UpdateSpecialGiftOfferInput = {
  offerId: string
  input: SpecialGiftOfferInput
}
