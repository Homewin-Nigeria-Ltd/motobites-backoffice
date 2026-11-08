export function formatCount(value: number) {
  return new Intl.NumberFormat("en-NG").format(value)
}

export function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value)
}

export function formatPercent(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(0)}%`
}

export function currentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export function shiftMonth(month: string, delta: number) {
  const [year, monthIndex] = month.split("-").map(Number)
  const next = new Date(year, monthIndex - 1 + delta, 1)

  return currentMonthKey(next)
}

export function monthName(month: string) {
  const [year, monthIndex] = month.split("-").map(Number)

  return new Date(year, monthIndex - 1, 1).toLocaleDateString("en-US", {
    month: "long",
  })
}

export function monthTitle(month: string) {
  const [year, monthIndex] = month.split("-").map(Number)

  return new Date(year, monthIndex - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
}

export function paceLabel(pace: string) {
  switch (pace) {
    case "behind":
      return "Behind"
    case "ahead":
      return "Ahead"
    case "on_track":
      return "On track"
    case "no_target":
      return "No target"
    case "suspended":
      return "Suspended"
    case "new":
      return "New, no target"
    case "no_signups":
      return "No signup in 7 days"
    default:
      return pace.replaceAll("_", " ")
  }
}

export function derivePace(qualified: number, target: number, status?: string) {
  if (status === "suspended") {
    return "suspended"
  }

  if (!target) {
    return "no_target"
  }

  if (qualified > target) {
    return "ahead"
  }

  if (qualified < target * 0.7) {
    return "behind"
  }

  return "on_track"
}
