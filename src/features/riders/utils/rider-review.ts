import type { ApiRider } from "../types"

export function canReviewRider(rider: ApiRider) {
  return rider.status?.toLowerCase() === "pending"
}
