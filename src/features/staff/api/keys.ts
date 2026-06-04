import type { StaffListParams } from "../types"

export const staffKeys = {
  all: ["staff"] as const,
  lists: () => [...staffKeys.all, "list"] as const,
  list: (params: StaffListParams) => [...staffKeys.lists(), params] as const,
}
