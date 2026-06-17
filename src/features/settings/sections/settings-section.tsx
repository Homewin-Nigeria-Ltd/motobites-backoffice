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
}

export function SettingsSection({ onLogoutClick }: SettingsSectionProps) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden bg-muted p-4 md:p-6">
      <div className="min-w-0 rounded-2xl border border-border bg-background p-5 md:p-8">
        <div className="grid min-w-0 grid-cols-1 gap-8 xl:grid-cols-2 xl:gap-x-12">
          <div className="min-w-0 space-y-8">
            {SETTINGS_LEFT_COLUMN.map((item) => (
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

          <div className="min-w-0 space-y-8">
            {SETTINGS_RIGHT_COLUMN.map((item) => (
              <SettingsLinkItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
