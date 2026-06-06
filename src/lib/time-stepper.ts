type TimeFormat = "12h" | "24h"

function detectTimeFormat(time: string): TimeFormat {
  return /am|pm/i.test(time) ? "12h" : "24h"
}

function parseTimeToMinutes(time: string): number {
  const trimmed = time.trim()

  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(Am|Pm)$/i)
  if (match12) {
    let hour = Number.parseInt(match12[1], 10)
    const minutes = Number.parseInt(match12[2], 10)
    const isPm = match12[3].toLowerCase() === "pm"

    if (isPm && hour !== 12) {
      hour += 12
    }

    if (!isPm && hour === 12) {
      hour = 0
    }

    return hour * 60 + minutes
  }

  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/)
  if (match24) {
    return (
      Number.parseInt(match24[1], 10) * 60 + Number.parseInt(match24[2], 10)
    )
  }

  return 8 * 60
}

function formatMinutes(minutes: number, format: TimeFormat): string {
  const normalized = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60)
  const hour24 = Math.floor(normalized / 60)
  const minute = normalized % 60
  const minuteString = String(minute).padStart(2, "0")

  if (format === "24h") {
    return `${String(hour24).padStart(2, "0")}:${minuteString}`
  }

  const isPm = hour24 >= 12
  let hour12 = hour24 % 12
  if (hour12 === 0) {
    hour12 = 12
  }

  return `${hour12}:${minuteString} ${isPm ? "Pm" : "Am"}`
}

export function stepTime(time: string, deltaMinutes: number): string {
  const format = detectTimeFormat(time)
  const minutes = parseTimeToMinutes(time) + deltaMinutes
  return formatMinutes(minutes, format)
}
