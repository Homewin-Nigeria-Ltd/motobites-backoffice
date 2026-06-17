"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { AccountSettingsSection } from "@/features/account-settings"
import { authKeys, useSession } from "@/features/auth"
import { AppLoader } from "@/components/ui/app-loader"

export function AccountSettingsPageClient() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: session, isPending, isError } = useSession()

  if (isPending) {
    return <AppLoader className="flex-1 bg-muted p-12" />
  }

  if (isError || !session?.user) {
    return (
      <div className="flex flex-1 items-center justify-center bg-muted p-6 text-sm text-destructive">
        Could not load account settings.
      </div>
    )
  }

  return (
    <AccountSettingsSection
      user={session.user}
      onPersonalInfoUpdated={() => {
        void queryClient.invalidateQueries({ queryKey: authKeys.session() })
        router.refresh()
      }}
    />
  )
}
