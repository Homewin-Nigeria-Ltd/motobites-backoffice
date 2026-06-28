export type AuthUserPermission = {
  key: string
  name: string
  description: string
  has_access: boolean
}

export type AuthUserPermissionsSummary = {
  granted_count: number
  total_count: number
  grant_status: string
  grant_label: string
}

export type AuthUser = {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: string
  profile_photo_url: string | null
  admin_role?: string | null
  permissions?: AuthUserPermission[]
  permission_keys?: string[]
  permissions_summary?: AuthUserPermissionsSummary
}

export type Session = {
  user: AuthUser
}

export type LoginActionResult =
  | { success: true }
  | { success: false; error: string }

export type LoginResponseData = {
  token: string
  user: {
    email: string
    role: string
  }
}

export type MeResponseData = {
  user: AuthUser
}

export type MeApiResponse = {
  success: boolean
  data: MeResponseData
  message?: string
}
