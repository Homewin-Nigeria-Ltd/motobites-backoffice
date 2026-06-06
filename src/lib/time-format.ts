export function normalizeTimeForApi(time: string): string {
  const trimmed = time.trim()

  if (/^\d{1,2}:\d{2}$/.test(trimmed) && !/am|pm/i.test(trimmed)) {
    const [hours, minutes] = trimmed.split(":")
    return `${hours.padStart(2, "0")}:${minutes}`
  }

  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(Am|Pm)$/i)
  if (!match) {
    return trimmed
  }

  let hour = Number.parseInt(match[1], 10)
  const minutes = match[2]
  const isPm = match[3].toLowerCase() === "pm"

  if (isPm && hour !== 12) {
    hour += 12
  }

  if (!isPm && hour === 12) {
    hour = 0
  }

  return `${String(hour).padStart(2, "0")}:${minutes}`
}
