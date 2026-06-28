import { StaffManagementSection } from "@/features/staff"
import { PERMISSION_KEYS } from "@/lib/permissions"
import { requirePermission } from "@/lib/require-permission"

export default async function StaffManagementPage() {
  await requirePermission(PERMISSION_KEYS.staffManagement)

  return <StaffManagementSection />
}
