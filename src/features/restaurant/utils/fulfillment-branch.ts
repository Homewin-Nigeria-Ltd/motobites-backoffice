import type { ApiFulfillmentBranch, FulfillmentBranch } from "../types"

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
