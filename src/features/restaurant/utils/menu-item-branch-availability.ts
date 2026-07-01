import type { ApiMenuItem, ApiMenuItemBranchAvailability } from "../types"

export function getMenuItemBranchAvailability(
  item: Pick<
    ApiMenuItem,
    | "branch_availability"
    | "fulfillment_branch_id"
    | "fulfillment_branch"
    | "is_available"
  >,
  branchId: string
) {
  const branchEntry = item.branch_availability?.find(
    (entry) =>
      String(entry.fulfillment_branch_id) === branchId ||
      String(entry.fulfillment_branch.id) === branchId
  )

  if (branchEntry) {
    return branchEntry.is_available
  }

  const singleBranchId =
    item.fulfillment_branch_id ?? item.fulfillment_branch?.id ?? null

  if (singleBranchId !== null && String(singleBranchId) === branchId) {
    return item.is_available
  }

  return false
}

export function mergeBranchAvailability(
  branchAvailability: ApiMenuItemBranchAvailability[] | undefined,
  branchId: number,
  isAvailable: boolean,
  branchMeta?: Pick<ApiMenuItemBranchAvailability["fulfillment_branch"], "name" | "key">
): ApiMenuItemBranchAvailability[] {
  const existing = branchAvailability ?? []
  const index = existing.findIndex(
    (entry) => entry.fulfillment_branch_id === branchId
  )

  if (index === -1) {
    return [
      ...existing,
      {
        fulfillment_branch_id: branchId,
        fulfillment_branch: {
          id: branchId,
          key: branchMeta?.key ?? "",
          name: branchMeta?.name ?? "",
        },
        is_available: isAvailable,
        is_customer_available: isAvailable,
        unavailable_today: false,
        unavailable_until: null,
      },
    ]
  }

  return existing.map((entry, currentIndex) =>
    currentIndex === index
      ? {
          ...entry,
          is_available: isAvailable,
          is_customer_available: isAvailable,
        }
      : entry
  )
}
