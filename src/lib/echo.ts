import Echo from "laravel-echo"
import Pusher from "pusher-js"

declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

/** Browser-only. Import from client components or hooks only. */
let echoInstance: Echo<"pusher"> | undefined

const BROADCAST_AUTH_ENDPOINT = "/api/proxy/broadcasting/auth"

function createEcho() {
  window.Pusher = Pusher

  return new Echo({
    broadcaster: "pusher",
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    forceTLS: true,
    authEndpoint: BROADCAST_AUTH_ENDPOINT,
    auth: {
      headers: {
        Accept: "application/json",
      },
    },
    withCredentials: true,
  })
}

export function getEcho(): Echo<"pusher"> | null {
  if (typeof window === "undefined") {
    return null
  }

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER

  if (!key || !cluster) {
    return null
  }

  if (!echoInstance) {
    echoInstance = createEcho()
  }

  return echoInstance
}

export function disconnectEcho() {
  if (!echoInstance) {
    return
  }

  echoInstance.disconnect()
  echoInstance = undefined
}

export const echo = new Proxy({} as Echo<"pusher">, {
  get(_target, prop) {
    const instance = getEcho()

    if (!instance) {
      throw new Error("Echo must run in the browser only.")
    }

    const value = Reflect.get(instance, prop, instance)

    return typeof value === "function"
      ? value.bind(instance)
      : value
  },
})
