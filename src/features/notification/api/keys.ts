import type { NotificationsListParams } from "../types"

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (params: NotificationsListParams) =>
    [...notificationKeys.all, "list", params] as const,
}
