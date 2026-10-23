import { api } from "@/lib/api/client"

import { broadcastEndpoints } from "./endpoints"
import type { BroadcastNotificationInput } from "../types"

export const broadcastMutations = {
  send: {
    mutationFn: (input: BroadcastNotificationInput) =>
      api.post<unknown, BroadcastNotificationInput>(
        broadcastEndpoints.broadcast,
        input
      ),
  },
} as const
