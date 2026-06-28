import type { StaffMember } from "@/features/staff/types"

export function getStaffResolverId(member: StaffMember) {
  return member.userId
}

export function findStaffByResolverId(
  staff: StaffMember[],
  resolverId: string | number | null | undefined
) {
  if (resolverId == null || resolverId === "") {
    return null
  }

  const numericId = Number(resolverId)
  if (Number.isNaN(numericId)) {
    return null
  }

  return (
    staff.find((member) => member.userId === numericId) ??
    staff.find((member) => Number(member.id) === numericId) ??
    null
  )
}
