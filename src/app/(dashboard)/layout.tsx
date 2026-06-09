import { redirect } from "next/navigation"

import { DashboardLayout } from "@/components/layouts/dashboard"
import type { AuthUser } from "@/features/auth"
import { authEndpoints } from "@/features/auth/api/endpoints"
import type { MeResponseData } from "@/features/auth/types"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  let user: AuthUser

  try {
    const { user: sessionUser } = await apiServer.get<MeResponseData>(
      authEndpoints.meServer
    )
    user = sessionUser
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      redirect("/api/auth/clear-session")
    }

    throw error
  }

  return <DashboardLayout user={user}>{children}</DashboardLayout>
}
