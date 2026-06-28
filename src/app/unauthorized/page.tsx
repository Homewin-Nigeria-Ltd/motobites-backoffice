import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Access denied</h1>
      <p className="max-w-md text-muted-foreground">
        You do not have permission to view this page. Contact an administrator
        if you believe this is a mistake.
      </p>
      <Button asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  )
}
