"use client"

import { useState } from "react"

import { LogoutConfirmDialog } from "@/features/auth/components/logout-confirm-dialog"
import { SettingsSection } from "@/features/settings"

export function SettingsPageClient() {
  const [logoutOpen, setLogoutOpen] = useState(false)

  return (
    <>
      <SettingsSection onLogoutClick={() => setLogoutOpen(true)} />
      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  )
}
