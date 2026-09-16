import { redirect } from "next/navigation"

import { DashboardSection } from "@/features/dashboard"
import { getLandingRoute } from "@/lib/get-landing-route"
import { getPermissions } from "@/lib/permissions"
import { getUser } from "@/lib/get-user"

export default async function DashboardPage() {
  const [user, permissions] = await Promise.all([getUser(), getPermissions()])

  if (permissions.canAccessDashboardOverview) {
    return <DashboardSection />
  }

  const landingRoute = getLandingRoute(user)

  if (landingRoute !== "/dashboard") {
    redirect(landingRoute)
  }

  redirect("/unauthorized")
}
