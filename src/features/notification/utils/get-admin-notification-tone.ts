import {
  ADMIN_NOTIFICATION_SOUND_SRC,
  ADMIN_NOTIFICATION_TONES,
} from "../constants"

export function getAdminNotificationTone(category?: string | null) {
  switch (category) {
    case "new_order":
      return ADMIN_NOTIFICATION_TONES.tone1
    case "order_ready":
      return ADMIN_NOTIFICATION_TONES.tone2
    case "delivery_pickup":
      return ADMIN_NOTIFICATION_TONES.tone3
    case "late_order":
      return ADMIN_NOTIFICATION_TONES.tone4
    default:
      return ADMIN_NOTIFICATION_SOUND_SRC
  }
}
