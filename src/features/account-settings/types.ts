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
  name: string
  last_used_at: string | null
  created_at: string
  is_current: boolean
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
