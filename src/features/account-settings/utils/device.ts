import type { ApiAccountDevice } from "../types"
import { formatDate } from "@/utils/date"

export function getDeviceDisplayName(device: ApiAccountDevice) {
  return device.device_name?.trim() || device.name?.trim() || "Unknown device"
}

export function getDeviceLocationLabel(device: ApiAccountDevice) {
  if (device.location_name?.trim()) {
    return device.location_name.trim()
  }

  if (device.location?.trim()) {
    return device.location.trim()
  }

  if (device.ip_address?.trim()) {
    return device.ip_address.trim()
  }

  return "Location unavailable"
}

export function getDeviceStatusLabel(device: ApiAccountDevice) {
  if (device.status === "active_now" || device.is_current) {
    return "Active now"
  }

  const lastActive = device.last_active_at ?? device.last_used_at

  if (lastActive) {
    return `Last active ${formatDate(lastActive)}`
  }

  if (device.logged_in_at) {
    return `Logged in ${formatDate(device.logged_in_at)}`
  }

  return "No recent activity"
}

export function getDeviceLastActiveTime(device: ApiAccountDevice) {
  return device.last_active_at ?? device.last_used_at ?? device.logged_in_at
}
