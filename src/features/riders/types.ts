export const riderOverviewStatuses = [
  "active",
  "in_transit",
  "away",
  "offline",
] as const

export type RiderOverviewStatus = (typeof riderOverviewStatuses)[number]

export const riderStatusFilters = [
  "all",
  ...riderOverviewStatuses,
  "suspended",
  "pending_review",
] as const

export type RiderStatusFilter = (typeof riderStatusFilters)[number]

export type ApiRiderProfile = {
  avatar: string | null
  gender: string | null
  date_of_birth: string | null
  house_address: string | null
  proof_of_address_url: string | null
  guarantor_name: string | null
  guarantor_phone: string | null
  guarantor_email: string | null
  guarantor_relationship: string | null
  guarantor_address: string | null
  guarantor_proof_of_address_url: string | null
  nin: string | null
  nin_document_url: string | null
  driver_license_url: string | null
  bank_account_number: string | null
  bank_name: string | null
  bank_account_name: string | null
  review_notes: string | null
}

export type ApiRiderStats = {
  active_orders: number
  completed_orders: number
}

export type ApiRider = {
  id: number
  name: string
  first_name: string
  last_name: string | null
  email: string
  phone: string
  role: string
  status: string
  rider_status: string
  onboarding_status: string | null
  is_online: boolean
  can_receive_deliveries: boolean
  profile: ApiRiderProfile
  stats: ApiRiderStats
  created_at: string
  updated_at: string
  fulfillment_branch_id?: number | null
  fulfillment_branch?: {
    id: number
    name: string
    key?: string
  } | null
}

export type RidersListMeta = {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export type RidersListParams = {
  page: number
  per_page?: number
  search?: string
  status?: RiderStatusFilter
}

export type RidersListResponse = {
  data: ApiRider[]
  meta: RidersListMeta
}
