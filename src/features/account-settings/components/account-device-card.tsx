"use client"

import { useState } from "react"

import { useRevokeAccountDevice } from "../hooks/use-revoke-account-device"
import type { ApiAccountDevice } from "../types"
import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { formatDate } from "@/utils/date"

const PLACEHOLDER_DEVICE_LOCATION =
  "22 Anu Oluwapo St, Mushin, Lagos 102215, Lagos"

function getDeviceStatus(device: ApiAccountDevice) {
  if (device.is_current) {
    return "Active now"
  }

  if (!device.last_used_at) {
    return "No recent activity"
  }

  return `Last active ${formatDate(device.last_used_at)}`
}

type AccountDeviceCardProps = {
  device: ApiAccountDevice
}

export function AccountDeviceCard({ device }: AccountDeviceCardProps) {
  const [signOutOpen, setSignOutOpen] = useState(false)
  const { revokeDevice, isPending, pendingDeviceId } = useRevokeAccountDevice()
  const isRevoking = isPending && pendingDeviceId === device.id

  return (
    <>
      <Card className="rounded-xl py-0">
        <CardContent className="space-y-4 px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Icons.laptop
                size={20}
                className="shrink-0 text-muted-foreground"
              />
              <span className="truncate text-sm font-medium text-foreground">
                {device.name}
              </span>
            </div>

            {device.is_current ? (
              <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold tracking-wide text-primary uppercase">
                Current Device
              </span>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="shrink-0 border-primary px-3 text-primary hover:bg-secondary"
                disabled={isRevoking}
                onClick={() => setSignOutOpen(true)}
              >
                {isRevoking ? "Signing out..." : "Sign Out"}
              </Button>
            )}
          </div>

          <div className="border-t border-border pt-4">
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Icons.mapPin size={16} className="mt-0.5 shrink-0" />
                <span className="leading-relaxed">
                  {PLACEHOLDER_DEVICE_LOCATION}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.clock size={16} className="shrink-0" />
                <span>{getDeviceStatus(device)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <BaseAlertDialog
        title="Sign out device?"
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        confirmLabel="Sign Out"
        pendingLabel="Signing out..."
        confirmVariant="destructive"
        isPending={isRevoking}
        onConfirm={() => {
          void revokeDevice(device.id).then(() => {
            setSignOutOpen(false)
          })
        }}
      >
        This will sign out the device session for &quot;{device.name}&quot;.
      </BaseAlertDialog>
    </>
  )
}
