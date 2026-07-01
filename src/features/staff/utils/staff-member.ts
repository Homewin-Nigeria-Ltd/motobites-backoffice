import type { ApiStaffMember, StaffMember, StaffStatus } from "../types"

function normalizeStaffStatus(status: string): StaffStatus {
  const normalized = status.trim().toLowerCase()

  if (normalized === "active") {
    return "active"
  }

  if (normalized === "away" || normalized === "on_leave") {
    return "away"
  }

  return "inactive"
}

export function mapApiStaffMemberToStaffMember(
  member: ApiStaffMember
): StaffMember {
  return {
    id: String(member.id),
    userId: member.user_id,
    name: member.full_name || member.name,
    email: member.email,
    initials: member.initials,
    role: member.role_label || member.staff_role,
    staffRole: member.staff_role,
    joinedAt: member.joined_at,
    status: normalizeStaffStatus(member.presence_status),
    isFavorited: member.is_favorited,
    branchId: member.fulfillment_branch_id
      ? String(member.fulfillment_branch_id)
      : member.fulfillment_branch?.id
        ? String(member.fulfillment_branch.id)
        : "",
  }
}
