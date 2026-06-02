export type AuthUser = {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: string
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
