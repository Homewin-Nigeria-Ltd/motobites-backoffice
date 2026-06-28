import { cache } from "react"
import { redirect } from "next/navigation"

import { authEndpoints } from "@/features/auth/api/endpoints"
import type { AuthUser, MeResponseData } from "@/features/auth/types"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

export const getUser = cache(async (): Promise<AuthUser> => {
  try {
    const { user } = await apiServer.get<MeResponseData>(authEndpoints.meServer)

    return user
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      redirect("/api/auth/clear-session")
    }

    throw error
  }
})
