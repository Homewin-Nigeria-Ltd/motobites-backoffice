import Link from "next/link"

import { Button } from "@/components/ui/button"
import { DEFAULT_LANDING_ROUTE } from "@/config/landing-routes"
import { getLandingRoute } from "@/lib/get-landing-route"
import { getUser } from "@/lib/get-user"

export default async function UnauthorizedPage() {
  let backHref = "/login"

  try {
    const user = await getUser()
    const landingRoute = getLandingRoute(user)

    if (landingRoute !== DEFAULT_LANDING_ROUTE) {
      backHref = landingRoute
    }
  } catch {
    backHref = "/login"
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Access denied</h1>
      <p className="max-w-md text-muted-foreground">
        You do not have permission to view this page. Contact an administrator
        if you believe this is a mistake.
      </p>
      <Button asChild>
        <Link href={backHref}>
          {backHref === "/login" ? "Back to login" : "Go to home"}
        </Link>
      </Button>
    </div>
  )
}
