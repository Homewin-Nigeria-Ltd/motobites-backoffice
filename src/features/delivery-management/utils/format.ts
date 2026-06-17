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
