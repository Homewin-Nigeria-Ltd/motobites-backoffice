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
    mutationFn: ({ chatId, body, file }: SendCustomerChatMessageInput) => {
      if (file) {
        const formData = new FormData()
        formData.append("message_type", "image")
        formData.append("body", body)
        formData.append("message", body)
        formData.append("file", file)

        return api.post<SendCustomerChatMessageResponse, FormData>(
          customerChatEndpoints.messages(chatId),
          formData
        )
      }

      return api.post<SendCustomerChatMessageResponse, { body: string }>(
        customerChatEndpoints.messages(chatId),
        { body }
      )
    },
  },
  closeConversation: {
    mutationFn: ({ chatId }: CloseCustomerChatInput) =>
      api.post<CloseCustomerChatResponse>(customerChatEndpoints.close(chatId), {}),
  },
} as const
