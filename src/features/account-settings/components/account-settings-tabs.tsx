"use client"

import type { AccountSettingsTab } from "@/features/account-settings/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tabLabels: Record<AccountSettingsTab, string> = {
  "personal-information": "Personal Information",
  password: "Password",
  "manage-devices": "Manage Devices",
  "two-factor-authentication": "Two-Factor Authentication",
}

type AccountSettingsTabsProps = {
  value: AccountSettingsTab
  onChange: (value: AccountSettingsTab) => void
}

export function AccountSettingsTabs({
  value,
  onChange,
}: AccountSettingsTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2 border-b border-border pb-4"
      role="tablist"
      aria-label="Account settings"
    >
      {(Object.keys(tabLabels) as AccountSettingsTab[])
        .filter((tab) => tab !== "two-factor-authentication")
        .map((tab) => {
        const isActive = value === tab

        return (
          <Button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "h-auto rounded-lg px-4 py-2 text-sm font-medium",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:bg-transparent hover:text-foreground"
            )}
            onClick={() => onChange(tab)}
          >
            {tabLabels[tab]}
          </Button>
        )
      })}
    </div>
  )
}
