export const ACTIVE_RIDER_STORAGE_KEY = "motobites:rider-chat:active-rider-id"
export const RIDER_ID_PARAM = "riderId"

export const RIDER_SUPPORT_CHANNEL_PREFIX = "rider-support"
export const RIDER_SUPPORT_MESSAGE_EVENT = ".rider.support.message.sent"

export function getRiderSupportChannelName(riderId: number | string) {
  return `${RIDER_SUPPORT_CHANNEL_PREFIX}.${riderId}`
}
