"use client"

import { useCallback, useEffect, useState } from "react"

export type NavigatorCoordinates = {
  latitude: number
  longitude: number
}

type NavigatorGeolocationOptions = {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

const DEFAULT_GEOLOCATION_OPTIONS: NavigatorGeolocationOptions = {
  enableHighAccuracy: false,
  timeout: 10_000,
  maximumAge: 60_000,
}

type NavigatorUserAgentData = {
  platform?: string
  model?: string
  getHighEntropyValues?: (
    hints: string[]
  ) => Promise<{ platform?: string; model?: string }>
}

function getUserAgentData() {
  if (typeof navigator === "undefined" || !("userAgentData" in navigator)) {
    return null
  }

  return navigator.userAgentData as NavigatorUserAgentData
}

function parseDeviceNameFromUserAgent(userAgent: string, platform: string) {
  if (/iPhone/.test(userAgent)) return "iPhone"
  if (/iPad/.test(userAgent)) return "iPad"
  if (/Android/.test(userAgent)) return "Android"
  if (/Mac/.test(userAgent) || platform.includes("Mac")) return "Mac"
  if (/Win/.test(userAgent) || platform.includes("Win")) return "Windows"
  if (/Linux/.test(userAgent) || platform.includes("Linux")) return "Linux"

  return platform || "Web Browser"
}

export async function getNavigatorDeviceName() {
  if (typeof navigator === "undefined") {
    return "Unknown device"
  }

  const userAgentData = getUserAgentData()

  if (userAgentData?.getHighEntropyValues) {
    try {
      const data = await userAgentData.getHighEntropyValues([
        "platform",
        "model",
      ])

      if (data.model?.trim()) {
        return `${data.platform} ${data.model}`.trim()
      }

      if (data.platform?.trim()) {
        return data.platform
      }
    } catch {
      // Fall back to user-agent parsing below.
    }
  }

  return parseDeviceNameFromUserAgent(
    navigator.userAgent,
    navigator.platform ?? ""
  )
}

export function getNavigatorCoordinates(
  options: NavigatorGeolocationOptions = DEFAULT_GEOLOCATION_OPTIONS
) {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null)
  }

  return new Promise<NavigatorCoordinates | null>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => resolve(null),
      options
    )
  })
}

export function useNavigator() {
  const [deviceName, setDeviceName] = useState("Unknown device")
  const [coordinates, setCoordinates] = useState<NavigatorCoordinates | null>(
    null
  )

  const isGeolocationSupported =
    typeof navigator !== "undefined" && Boolean(navigator.geolocation)

  useEffect(() => {
    void getNavigatorDeviceName().then(setDeviceName)
    void getNavigatorCoordinates().then(setCoordinates)
  }, [])

  const refreshLocation = useCallback(
    (options?: NavigatorGeolocationOptions) =>
      getNavigatorCoordinates(options).then((nextCoordinates) => {
        if (nextCoordinates) {
          setCoordinates(nextCoordinates)
        }

        return nextCoordinates
      }),
    []
  )

  const refreshDeviceName = useCallback(
    () => getNavigatorDeviceName().then(setDeviceName),
    []
  )

  return {
    deviceName,
    coordinates,
    latitude: coordinates?.latitude ?? null,
    longitude: coordinates?.longitude ?? null,
    isGeolocationSupported,
    refreshLocation,
    refreshDeviceName,
  }
}
