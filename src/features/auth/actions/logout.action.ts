"use server"

import { cookies } from "next/headers"

import { AUTH_COOKIE_NAME } from "@/constants/auth"
import { authEndpoints } from "../api/endpoints"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete({
    name: AUTH_COOKIE_NAME,
    path: "/",
  })
}

export async function logoutAction(): Promise<void> {
  try {
    await apiServer.post(authEndpoints.logout)
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error
    }
  } finally {
    await clearAuthCookie()
  }
}
