import { redirect } from "next/navigation"

import { OfflineOrderDeleteRequestSection } from "@/features/offline-order"
import { isSalesManager } from "@/features/offline-order/utils/admin-role"
import { getUser } from "@/lib/get-user"

export default async function OfflineOrderDeleteRequestPage() {
  const user = await getUser()

  if (!isSalesManager(user)) {
    redirect("/offline-order/all")
  }

  return <OfflineOrderDeleteRequestSection />
}
