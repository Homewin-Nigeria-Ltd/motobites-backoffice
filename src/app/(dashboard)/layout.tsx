import { DashboardLayout } from "@/components/layouts/dashboard"
import type { AuthUser } from "@/features/auth"
import type { MeResponseData } from "@/features/auth/types"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

const fallbackUser: AuthUser = {
  id: 0,
  name: "System Admin",
  email: "admin@motobites.com",
  phone: "",
  role: "admin",
  status: "active",
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = fallbackUser

  try {
    const { user: sessionUser } = await apiServer.get<MeResponseData>(
      "/admin/auth/me"
    )
    user = sessionUser
  } catch (error) {
    if (!(error instanceof ApiError && error.status === 401)) {
      throw error
    }
  }

  return <DashboardLayout user={user}>{children}</DashboardLayout>
}
