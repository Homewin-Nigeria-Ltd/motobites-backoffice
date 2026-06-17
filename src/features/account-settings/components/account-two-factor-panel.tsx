"use client"

import { useAccountTwoFactor } from "../hooks/use-account-two-factor"
import { useUpdateAccountTwoFactor } from "../hooks/use-update-account-two-factor"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function formatTwoFactorMethod(method: string | null) {
  if (!method) {
    return null
  }

  return method
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function AccountTwoFactorPanel() {
  const { data, isPending, isError, error } = useAccountTwoFactor()
  const { updateTwoFactor, isPending: isUpdating } = useUpdateAccountTwoFactor()

  if (isError) {
    throw error
  }

  if (isPending) {
    return <AppLoader className="py-12" />
  }

  const enabled = data.enabled
  const methodLabel = formatTwoFactorMethod(data.method)

  const handleToggle = (nextEnabled: boolean) => {
    if (nextEnabled === enabled || isUpdating) {
      return
    }

    void updateTwoFactor(nextEnabled)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12">
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          2-Factor Authentication
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Enable extra security layer on your account.
        </p>
      </div>

      <Card className="rounded-xl py-0">
        <CardContent className="space-y-6 px-6 py-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Two-factor authentication is an extra layer of security that
            requires users to enter a code from their device when logging into
            their account from an untrusted device.
          </p>

          {methodLabel ? (
            <p className="text-sm text-foreground">
              Method: <span className="font-medium">{methodLabel}</span>
            </p>
          ) : null}

          {data.setup_required ? (
            <p className="text-sm text-amber-700">
              Complete authenticator setup to finish enabling two-factor
              authentication.
            </p>
          ) : null}

          <div className="inline-flex rounded-full bg-muted p-1">
            <Button
              type="button"
              variant="ghost"
              disabled={isUpdating}
              onClick={() => handleToggle(false)}
              className={cn(
                "h-auto rounded-full px-6 py-2 text-sm font-medium shadow-none",
                !enabled
                  ? "bg-background text-primary shadow-sm hover:bg-background"
                  : "text-muted-foreground hover:bg-transparent"
              )}
            >
              Disabled
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={isUpdating}
              onClick={() => handleToggle(true)}
              className={cn(
                "h-auto rounded-full px-6 py-2 text-sm font-medium shadow-none",
                enabled
                  ? "bg-background text-primary shadow-sm hover:bg-background"
                  : "text-muted-foreground hover:bg-transparent"
              )}
            >
              {isUpdating ? "Saving..." : "Enabled"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
