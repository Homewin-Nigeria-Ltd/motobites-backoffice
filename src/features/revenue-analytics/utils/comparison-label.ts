export function getRevenueComparisonLabel(periodKey: string) {
  switch (periodKey) {
    case "24h":
      return "vs last 24 hours"
    case "week":
      return "vs last week"
    case "3months":
      return "vs last 3 months"
    case "year":
      return "vs last year"
    default:
      return "vs last period"
  }
}
