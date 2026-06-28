import { api } from "@/lib/api/client"
import type {
  CloseCustomerChatInput,
  CloseCustomerChatResponse,
  SendCustomerChatMessageInput,
  SendCustomerChatMessageResponse,
} from "../types"
import { customerChatEndpoints } from "./endpoints"

export const customerChatMutations = {
  sendMessage: {
    mutationFn: ({ chatId, body }: SendCustomerChatMessageInput) =>
      api.post<SendCustomerChatMessageResponse, { body: string }>(
        customerChatEndpoints.messages(chatId),
        { body }
      ),
  },
  closeConversation: {
    mutationFn: ({ chatId }: CloseCustomerChatInput) =>
      api.post<CloseCustomerChatResponse>(customerChatEndpoints.close(chatId), {}),
  },
} as const
