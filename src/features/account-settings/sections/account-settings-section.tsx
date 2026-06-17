"use client"

import { useState } from "react"

import { AccountManageDevicesPanel } from "../components/account-manage-devices-panel"
import { AccountPasswordPanel } from "../components/account-password-panel"
import { AccountPersonalInformationPanel } from "../components/account-personal-information-panel"
import { AccountSettingsTabs } from "../components/account-settings-tabs"
import { AccountTwoFactorPanel } from "../components/account-two-factor-panel"
import type { AccountSettingsTab, AccountUser } from "../types"

type AccountSettingsSectionProps = {
  user: AccountUser
  onPersonalInfoUpdated?: () => void
}

export function AccountSettingsSection({
  user,
  onPersonalInfoUpdated,
}: AccountSettingsSectionProps) {
  const [tab, setTab] = useState<AccountSettingsTab>("personal-information")

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <AccountSettingsTabs value={tab} onChange={setTab} />

        <div className="pt-8">
          {tab === "personal-information" ? (
            <AccountPersonalInformationPanel
              user={user}
              onUpdated={onPersonalInfoUpdated}
            />
          ) : null}
          {tab === "password" ? <AccountPasswordPanel /> : null}
          {tab === "manage-devices" ? <AccountManageDevicesPanel /> : null}
          {tab === "two-factor-authentication" ? (
            <AccountTwoFactorPanel />
          ) : null}
        </div>
      </div>
    </div>
  )
}
