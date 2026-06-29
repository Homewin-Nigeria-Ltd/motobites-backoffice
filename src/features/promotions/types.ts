export type OfferTab = "all" | "active" | "inactive" | "expired"

export type OfferStatus = "active" | "inactive" | "expired"

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
}

export type OfferListParams = {
  tab?: OfferTab
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
  status: string
  status_label: string
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
  applies_to: string
  restriction: string
  kitchen_id: number | null
  start_date: string
  end_date: string
  promo_start: string
  promo_end: string
  is_active: boolean
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
