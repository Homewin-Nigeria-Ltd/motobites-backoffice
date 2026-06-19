import { api } from "@/lib/api/client"
import type {
  SendSupportMessageInput,
  SendSupportMessageResponse,
} from "../types"
import { riderChatEndpoints } from "./endpoints"

export const riderChatMutations = {
  sendMessage: {
    mutationFn: ({ riderId, message }: SendSupportMessageInput) =>
      api.post<SendSupportMessageResponse, { message: string }>(
        riderChatEndpoints.messages(riderId),
        { message }
      ),
  },
} as const
