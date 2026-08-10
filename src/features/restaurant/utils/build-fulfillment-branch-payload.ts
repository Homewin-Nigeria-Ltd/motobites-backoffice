import type { CreateFulfillmentBranchInput } from "@/features/restaurant/types"
import type { FulfillmentBranchFormValues } from "@/features/restaurant/schemas/fulfillment-branch-form.schema"

export function buildFulfillmentBranchPayload(
  values: FulfillmentBranchFormValues,
): CreateFulfillmentBranchInput {
  return {
    key: values.key.trim(),
    name: values.name.trim(),
    address: values.address.trim(),
    latitude: values.latitude,
    longitude: values.longitude,
    is_active: values.isActive,
    is_open: values.isOpen,
  }
}
