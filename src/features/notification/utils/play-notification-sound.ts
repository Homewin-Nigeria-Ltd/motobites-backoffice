import { ADMIN_NOTIFICATION_SOUND_SRC } from "../constants"
import { getAdminNotificationTone } from "./get-admin-notification-tone"

const notificationSounds = new Map<string, HTMLAudioElement>()

function getNotificationSound(src: string) {
  if (typeof window === "undefined") {
    return null
  }

  let sound = notificationSounds.get(src)
  if (!sound) {
    sound = new Audio(src)
    sound.preload = "auto"
    notificationSounds.set(src, sound)
  }

  return sound
}

export function playNotificationSound(src?: string) {
  const sound = getNotificationSound(src ?? ADMIN_NOTIFICATION_SOUND_SRC)
  if (!sound) {
    return
  }

  sound.currentTime = 0
  void sound.play().catch(() => {
    // Browsers may block autoplay until the user interacts with the page.
  })
}

export function playNotificationSoundForCategory(category?: string | null) {
  playNotificationSound(getAdminNotificationTone(category))
}
