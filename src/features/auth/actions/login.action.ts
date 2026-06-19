"use server"

import { cookies } from "next/headers"

import { loginPayloadSchema, type LoginPayload } from "../schemas/login.schema"
import type { LoginActionResult, LoginResponseData } from "../types"
import { AUTH_COOKIE_NAME } from "@/constants/auth"
import { authEndpoints } from "../api/endpoints"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
}

export async function loginAction(data: LoginPayload): Promise<LoginActionResult> {
  const parsed = loginPayloadSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid credentials",
    }
  }

  try {
    const { token } = await apiServer.post<LoginResponseData, LoginPayload>(
      authEndpoints.login,
      parsed.data,
      { auth: false }
    )

    await setAuthCookie(token)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message || "Invalid email or password",
      }
    }

    throw error
  }
}
