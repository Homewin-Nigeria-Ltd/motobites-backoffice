import { ADMIN_NOTIFICATION_SOUND_SRC } from "../constants"

let notificationSound: HTMLAudioElement | null = null

function getNotificationSound() {
  if (typeof window === "undefined") {
    return null
  }

  if (!notificationSound) {
    notificationSound = new Audio(ADMIN_NOTIFICATION_SOUND_SRC)
    notificationSound.preload = "auto"
  }

  return notificationSound
}

export function playNotificationSound() {
  const sound = getNotificationSound()
  if (!sound) {
    return
  }

  sound.currentTime = 0
  void sound.play().catch(() => {
    // Browsers may block autoplay until the user interacts with the page.
  })
}
