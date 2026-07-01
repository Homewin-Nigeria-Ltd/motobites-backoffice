export const ACTIVE_CHAT_STORAGE_KEY = "motobites:customer-chat:active-chat-id"
export const CHAT_ID_PARAM = "chatId"

export const CUSTOMER_SUPPORT_CHANNEL_PREFIX = "support"
export const CUSTOMER_SUPPORT_MESSAGE_EVENT = ".SupportMessageSent"
export const CUSTOMER_SUPPORT_MESSAGE_EVENT_CLASS =
  ".App\\Modules\\Customer\\Support\\Events\\SupportMessageSent"

export function isCustomerSupportMessageEvent(eventName: string) {
  return eventName.includes("SupportMessageSent")
}

export function getCustomerSupportChannelName(conversationId: string) {
  return `${CUSTOMER_SUPPORT_CHANNEL_PREFIX}.${conversationId}`
}
