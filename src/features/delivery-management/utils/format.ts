export function formatDeliveryCount(value: number) {
  return value.toLocaleString("en-US")
}

export function formatCompactDeliveryCount(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}k`
  }

  return String(value)
}

export function formatCoverageRate(value: number) {
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 1,
  })}%`
}

export function formatOrderFrequencyHour(hour: string) {
  const hourPart = hour.split(":")[0]
  const parsedHour = Number.parseInt(hourPart, 10)

  if (Number.isNaN(parsedHour)) {
    return hour
  }

  if (parsedHour === 0) return "12am"
  if (parsedHour === 12) return "12pm"
  if (parsedHour < 12) return `${parsedHour}am`

  return `${parsedHour - 12}pm`
}
