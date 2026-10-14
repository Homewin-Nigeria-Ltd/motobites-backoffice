"use client"

import {
  SettingsActionItem,
  SettingsLinkItem,
} from "@/features/settings/components/settings-item"
import {
  SETTINGS_LEFT_COLUMN,
  SETTINGS_RIGHT_COLUMN,
} from "@/features/settings/types"

type SettingsSectionProps = {
  onLogoutClick: () => void
  showAdminSettings?: boolean
}

export function SettingsSection({
  onLogoutClick,
  showAdminSettings = false,
}: SettingsSectionProps) {
  const leftItems = SETTINGS_LEFT_COLUMN.filter(
    (item) => item.id === "account" || showAdminSettings
  )

  return (
    <div className="flex min-w-0 flex-col overflow-x-hidden bg-muted p-4 md:p-6">
      <div className="min-w-0 rounded-2xl border border-border bg-background p-5 md:p-8">
        <div className="grid min-w-0 grid-cols-1 gap-8 xl:grid-cols-2 xl:gap-x-12">
          <div className="min-w-0 space-y-8">
            {leftItems.map((item) => (
              <SettingsLinkItem key={item.id} item={item} />
            ))}

            <SettingsActionItem
              title="Log out"
              description="Log out from the application"
              icon="logout"
              iconVariant="danger"
              onClick={onLogoutClick}
            />
          </div>

          {showAdminSettings ? (
            <div className="min-w-0 space-y-8">
              {SETTINGS_RIGHT_COLUMN.map((item) => (
                <SettingsLinkItem key={item.id} item={item} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
