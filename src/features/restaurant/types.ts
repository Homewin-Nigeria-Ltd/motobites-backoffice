export type Menu = {
  id: string
  name: string
  description: string
  price: number
  durationMinutes: number
  imageUrl: string
  enabled: boolean
  isPopular?: boolean
}

export type Hub = {
  id: string
  name: string
  menus: Menu[]
}

export type FeedbackTag = {
  label: string
  count: number
}

export type MenuDetailItem = {
  id: string
  hub: string
  name: string
  description: string
  imageUrl: string
  rating: number
  itemsSold: number
  reviewCount: number
  itemErrors: number
  isPopular?: boolean
}

export type MenuCatalogListItem = {
  menu: Menu
  hubId: string
  hubName: string
}

export type MenuVariation = {
  id: string
  optionName: string
  price: string
  duration: string
}

export type MenuAvailabilityRow = {
  id: string
  day: string
  startTime: string
  endTime: string
  enabled?: boolean
}

export type MenuSortOption =
  | "Latest item"
  | "Oldest item"
  | "Price: low to high"
  | "Price: high to low"
  | "Name A–Z"

export type MenuDetailSortOption =
  | "Latest item"
  | "Oldest item"
  | "Most sold"
  | "Highest rated"
  | "Name A–Z"

export type RestaurantSortOption =
  | "Latest item"
  | "Oldest item"
  | "Name A–Z"
  | "Name Z–A"

export type OpeningHoursRow = {
  id: string
  day: string
  startTime: string
  endTime: string
  enabled?: boolean
}

export type Restaurant = {
  id: string
  name: string
  description: string
  imageUrl: string
  tags: string[]
  openingHours: OpeningHoursRow[]
  hubId: string
  menus: Menu[]
  isOpen?: boolean
}

export type RestaurantFormValues = {
  name: string
  description: string
  tags: string[]
  openingHours: OpeningHoursRow[]
  isOpen: boolean
  image: File | null
}

export type ApiKitchenOpeningHour = {
  day: string
  start_time: string
  end_time: string
}

export type ApiKitchenOpeningHoursStorage = Record<
  string,
  {
    open: string
    close: string
  }
>

export type ApiKitchen = {
  id: number
  kitchen_type_id: number | null
  name: string
  description: string | null
  tags: string[]
  image: string | null
  video_ref?: string | null
  videoRef?: string | null
  video_url?: string | null
  video_status?: string | null
  opening_hours: ApiKitchenOpeningHour[]
  opening_hours_storage?: ApiKitchenOpeningHoursStorage
  is_open: boolean
  is_active: boolean
}

export type ApiKitchenDetail = ApiKitchen & {
  meal_count?: number
  meal_count_label?: string
}

export type ApiKitchensResponse = {
  success: boolean
  data: ApiKitchen[]
  message?: string
}

export type ApiFulfillmentBranch = {
  id: number
  key: string
  name: string
  address: string
  latitude: number
  longitude: number
  is_active: boolean
  is_open: boolean
}

export type ApiFulfillmentBranchesResponse = {
  success: boolean
  data: ApiFulfillmentBranch[]
  message?: string
}

export type ApiFulfillmentBranchResponse = {
  success: boolean
  data: ApiFulfillmentBranch
  message?: string
}

export type CreateFulfillmentBranchInput = {
  key: string
  name: string
  address: string
  latitude: number
  longitude: number
  is_active: boolean
  is_open: boolean
}

export type UpdateFulfillmentBranchInput = {
  id: string | number
} & CreateFulfillmentBranchInput

export type FulfillmentBranch = {
  id: string
  key: string
  name: string
  address: string
  latitude: number
  longitude: number
  isActive: boolean
  isOpen: boolean
}

export type ApiKitchenDetailResponse = {
  success: boolean
  data: ApiKitchenDetail
  message?: string
}

export type KitchenOpeningHoursPayload = Array<{
  day: string
  start_time: string
  end_time: string
}>

export type RestaurantActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }

export type KitchenMutationResponse = {
  success: boolean
  data: ApiKitchen
  message?: string
}

export type MenuFormValues = {
  name: string
  description: string
  price: string
  durationMinutes: string
  enabled: boolean
}

export type ApiMenuKitchen = {
  id: number
  name: string
  image: string | null
  image_url?: string | null
  is_active?: boolean
}

export type ApiMenuItemImage = {
  id?: number
  image_path?: string | null
  image_url?: string | null
  title?: string | null
  sort_order?: number
  created_at?: string
}

export type ApiMenuItemTags = {
  display_rating?: number
  display_review_count?: number
  volume_label?: string
  volume_ml?: number
  is_alcoholic?: boolean
  age_restricted?: boolean
}

export type ApiMenuItemVariation = {
  id?: number
  name?: string
  option_name?: string
  price?: number
  preparation_time_minutes?: number
}

export type ApiMenuItemBranchAvailability = {
  fulfillment_branch_id: number
  fulfillment_branch: {
    id: number
    key: string
    name: string
  }
  is_available: boolean
  is_customer_available: boolean
  unavailable_today: boolean
  unavailable_until: string | null
}

export type ApiMenuItem = {
  id: number
  name: string
  description: string | null
  image?: string | null
  image_url?: string | null
  images?: ApiMenuItemImage[]
  video_ref?: string | null
  video_url?: string | null
  videos?: unknown[]
  price: number
  preparation_time_minutes: number
  tags?: string[] | ApiMenuItemTags | unknown[]
  is_available: boolean
  is_customer_available: boolean
  unavailable_today: boolean
  is_popular: boolean
  availability_type: string
  availability_start?: string | null
  availability_end?: string | null
  variations?: ApiMenuItemVariation[]
  kitchen: {
    id: number
    name: string
  }
  fulfillment_branch_id?: number | null
  fulfillment_branch?: {
    id: number
    name: string
    key?: string
  } | null
  branch_availability?: ApiMenuItemBranchAvailability[]
  category: {
    id: number
    name: string
  }
}

export type ApiMenuItemDetail = ApiMenuItem & {
  variations_count?: number
}

export type ApiMenuItemDetailStats = {
  items_sold: number
  review_count: number
  item_errors: number
  is_popular: boolean
  rating: number
}

export type ApiMenuItemDetailData = {
  item: ApiMenuItemDetail
  stats: ApiMenuItemDetailStats
}

export type ApiMenuItemDetailResponse = {
  success: boolean
  data: ApiMenuItemDetailData
  message?: string
}

export type MenuItemMutationResponse = {
  success: boolean
  data: ApiMenuItem
  message?: string
}

export type ApiMenuGroupedItem = {
  kitchen: ApiMenuKitchen
  meal_count: number
  items: ApiMenuItem[]
}

export type ApiMenuGroupedResponse = {
  success: boolean
  data: ApiMenuGroupedItem[]
  message?: string
}

export type ApiMenuItemsMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type ApiMenuItemsListResponse = {
  success: boolean
  data: ApiMenuItem[]
  meta: ApiMenuItemsMeta
  message?: string
}
