export function formatDashboardCount(value: number) {
  return new Intl.NumberFormat("en-NG").format(value)
}

export function formatCompactCount(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}k`
  }

  return String(value)
}

export function formatDashboardCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCompactCurrency(amount: number) {
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  }

  if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(0)}k`
  }

  return formatDashboardCurrency(amount)
}
