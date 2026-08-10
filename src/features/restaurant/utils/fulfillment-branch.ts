import type { ApiFulfillmentBranch, FulfillmentBranch } from "../types"
import type { FulfillmentBranchFormValues } from "../schemas/fulfillment-branch-form.schema"

export function mapApiFulfillmentBranch(
  branch: ApiFulfillmentBranch
): FulfillmentBranch {
  return {
    id: String(branch.id),
    key: branch.key,
    name: branch.name,
    address: branch.address,
    latitude: branch.latitude,
    longitude: branch.longitude,
    isActive: branch.is_active,
    isOpen: branch.is_open,
  }
}

export function mapFulfillmentBranchToFormValues(
  branch: FulfillmentBranch,
): FulfillmentBranchFormValues {
  return {
    key: branch.key,
    name: branch.name,
    address: branch.address,
    latitude: branch.latitude,
    longitude: branch.longitude,
    isActive: branch.isActive,
    isOpen: branch.isOpen,
  }
}
