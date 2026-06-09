export type StaffStatus = "active" | "away" | "inactive"

export type ApiStaffRoleOption = {
  key: string
  label: string
}

export type StaffRoleOption = ApiStaffRoleOption

export type StaffMember = {
  id: string
  name: string
  email: string
  initials: string
  role: string
  staffRole: string
  joinedAt: string
  status: StaffStatus
  isFavorited: boolean
}

export type StaffListParams = {
  page: number
  per_page?: number
  search?: string
}

export type StaffListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type StaffListResponse = {
  items: StaffMember[]
  meta: StaffListMeta
}

export type ApiStaffMember = {
  id: number
  user_id: number
  name: string
  full_name: string
  email: string
  initials: string
  staff_role: string
  role_label: string
  presence_status: string
  is_favorited: boolean
  joined_at: string
}

export type ApiStaffListResponse = {
  success: boolean
  data: ApiStaffMember[]
  meta: StaffListMeta
  message?: string
}

export type ApiStaffMemberResponse = {
  success: boolean
  data: ApiStaffMember
  message?: string
}

export type ApiStaffRolesResponse = {
  success: boolean
  data: ApiStaffRoleOption[]
  message?: string
}

export type InviteStaffInput = {
  name: string
  email: string
  staff_role: string
}

export type UpdateStaffInput = {
  id: string
  name?: string
  email?: string
  staff_role?: string
}

export type StaffActionResult<T = undefined> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string }
