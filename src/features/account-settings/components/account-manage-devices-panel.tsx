"use client"

import { AccountDeviceCard } from "../components/account-device-card"
import { useAccountDevices } from "../hooks/use-account-devices"
import type { ApiAccountDevice } from "../types"
import { AppLoader } from "@/components/ui/app-loader"
import { Icons } from "@/components/ui/icons"

function sortDevices(devices: ApiAccountDevice[]) {
  return [...devices].sort((left, right) => {
    if (left.is_current !== right.is_current) {
      return left.is_current ? -1 : 1
    }

    const leftTime = left.last_used_at
      ? new Date(left.last_used_at).getTime()
      : 0
    const rightTime = right.last_used_at
      ? new Date(right.last_used_at).getTime()
      : 0

    return rightTime - leftTime
  })
}

export function AccountManageDevicesPanel() {
  const { data: devices = [], isPending, isError, error } = useAccountDevices()

  if (isError) {
    throw error
  }

  if (isPending) {
    return <AppLoader className="py-12" />
  }

  const sortedDevices = sortDevices(devices)

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <div className="flex justify-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
            <Icons.userCog size={24} />
          </span>
        </div>
        <h3 className="text-lg font-semibold text-foreground">Managed Devices</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          This feature allows users to link and unlink various device associated
          with the platform, such as tablet, Phones or unidentified devices. You
          can sign out any unfamiliar devices or change your password for added
          security.
        </p>
      </div>

      {sortedDevices.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background px-6 py-12 text-center text-sm text-muted-foreground">
          No devices found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedDevices.map((device) => (
            <AccountDeviceCard key={device.id} device={device} />
          ))}
        </div>
      )}
    </div>
  )
}
