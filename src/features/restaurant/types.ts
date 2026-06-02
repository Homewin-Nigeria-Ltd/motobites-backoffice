export type Menu = {
  id: string
  name: string
  description: string
  price: number
  durationMinutes: number
  imageUrl: string
  enabled: boolean
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
}

export type RestaurantFormValues = {
  name: string
  description: string
  openingHours: OpeningHoursRow[]
}

export type MenuFormValues = {
  name: string
  description: string
  price: string
  durationMinutes: string
  enabled: boolean
}
