import type { RidersListParams } from "../types"

export const ridersKeys = {
  all: ["riders"] as const,
  list: (params: RidersListParams) =>
    [...ridersKeys.all, "list", params] as const,
}
