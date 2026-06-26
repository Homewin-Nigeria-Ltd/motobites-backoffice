export const ACTIVE_CHAT_STORAGE_KEY = "motobites:customer-chat:active-chat-id"
export const CHAT_ID_PARAM = "chatId"

export const CUSTOMER_SUPPORT_CHANNEL_PREFIX = "customer-support"
export const CUSTOMER_SUPPORT_MESSAGE_EVENT = ".customer.support.message.sent"

export function getCustomerSupportChannelName(chatId: string) {
  return `${CUSTOMER_SUPPORT_CHANNEL_PREFIX}.${chatId}`
}
