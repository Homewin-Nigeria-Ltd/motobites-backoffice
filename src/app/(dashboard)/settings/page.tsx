import { isSuperAdmin } from "@/features/offline-order/utils/admin-role"
import { getUser } from "@/lib/get-user"

import { SettingsPageClient } from "./settings-page-client"

export default async function SettingsPage() {
  const user = await getUser()

  return <SettingsPageClient showAdminSettings={isSuperAdmin(user)} />
}
