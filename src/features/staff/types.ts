export const staffRoles = [
  "Super Admin",
  "Admin",
  "Order Manager",
  "Kitchen Manager",
  "Customer Care Rep",
  "Rider",
  "Chef",
  "Inventory Manager",
] as const

export type StaffRole = (typeof staffRoles)[number]

export type StaffStatus = "active" | "away" | "inactive"

export type StaffMember = {
  id: string
  name: string
  email: string
  role: StaffRole
  joinedAt: string
  status: StaffStatus
}

export type StaffListParams = {
  page: number
  per_page?: number
  search?: string
}

export type StaffListResponse = {
  items: StaffMember[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
