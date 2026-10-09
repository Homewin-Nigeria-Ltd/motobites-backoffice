import { ADMIN_NOTIFICATION_SOUND_SRC } from "../constants"
import { getAdminNotificationTone } from "./get-admin-notification-tone"

const notificationSounds = new Map<string, HTMLAudioElement>()
let incomingLoopSrc: string | null = null

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
  const resolved = src ?? ADMIN_NOTIFICATION_SOUND_SRC
  if (incomingLoopSrc === resolved) {
    return
  }

  const sound = getNotificationSound(resolved)
  if (!sound) {
    return
  }

  sound.loop = false
  sound.currentTime = 0
  void sound.play().catch(() => {
    // Browsers may block autoplay until the user interacts with the page.
  })
}

export function startIncomingOrderSoundLoop(src?: string) {
  const resolved = src ?? ADMIN_NOTIFICATION_SOUND_SRC
  const sound = getNotificationSound(resolved)
  if (!sound) {
    return
  }

  incomingLoopSrc = resolved
  sound.loop = true

  if (!sound.paused) {
    return
  }

  sound.currentTime = 0
  void sound.play().catch(() => {
    // Browsers may block autoplay until the user interacts with the page.
  })
}

export function stopIncomingOrderSoundLoop() {
  if (!incomingLoopSrc) {
    return
  }

  const sound = notificationSounds.get(incomingLoopSrc)
  incomingLoopSrc = null

  if (!sound) {
    return
  }

  sound.loop = false
  sound.pause()
  sound.currentTime = 0
}

export function playNotificationSoundForCategory(category?: string | null) {
  playNotificationSound(getAdminNotificationTone(category))
}
