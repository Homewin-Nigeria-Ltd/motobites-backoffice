import {
  ADMIN_NOTIFICATION_SOUND_SRC,
  ADMIN_NOTIFICATION_TONES,
} from "../constants"

export function getAdminNotificationTone(category?: string | null) {
  const key = category?.trim().toLowerCase().replace(/-/g, "_") ?? ""

  if (key === "incoming_orders" || key === "incoming_order") {
    return ADMIN_NOTIFICATION_TONES.tone1
  }

  if (key === "ready") {
    return ADMIN_NOTIFICATION_TONES.tone2
  }

  if (key === "pickup" || key === "pick_up") {
    return ADMIN_NOTIFICATION_TONES.tone3
  }

  if (key === "late_order") {
    return ADMIN_NOTIFICATION_TONES.tone4
  }

  return ADMIN_NOTIFICATION_SOUND_SRC
}
