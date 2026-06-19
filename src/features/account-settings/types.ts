export type AccountUser = {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: string
  profile_photo_url: string | null
}

export type AccountSettingsTab =
  | "personal-information"
  | "password"
  | "manage-devices"
  | "two-factor-authentication"

export type UpdateAccountPasswordInput = {
  current_password: string
  password: string
  password_confirmation: string
}

export type UpdateAccountPasswordApiResponse = {
  success: boolean
  message?: string
}

export type UpdateAccountPersonalInfoInput = {
  first_name: string
  last_name: string
  language: string
  profile_photo_path?: string
  profile_photo?: string
}

export type UpdateAccountPersonalInfoApiResponse = {
  success: boolean
  message?: string
}

export type ApiAccountDevice = {
  id: number
  session_id?: number
  token_id: number
  name: string
  device_name: string
  location: string | null
  location_name: string | null
  location_latitude: number | null
  location_longitude: number | null
  location_source: string | null
  ip_address: string | null
  user_agent: string | null
  last_used_at: string | null
  last_active_at: string | null
  logged_in_at: string | null
  created_at: string
  logged_out_at: string | null
  is_current: boolean
  is_active: boolean
  status: string
}

export type AccountDevicesApiResponse = {
  success: boolean
  data: ApiAccountDevice[]
}

export type RevokeAccountDeviceApiResponse = {
  success: boolean
  message?: string
}

export type AccountTwoFactor = {
  enabled: boolean
  method: string | null
  setup_required: boolean
}

export type AccountTwoFactorApiResponse = {
  success: boolean
  data: AccountTwoFactor
}

export type UpdateAccountTwoFactorInput = {
  enabled: boolean
}

export type UpdateAccountTwoFactorApiResponse = {
  success: boolean
  message?: string
  data?: AccountTwoFactor
}
