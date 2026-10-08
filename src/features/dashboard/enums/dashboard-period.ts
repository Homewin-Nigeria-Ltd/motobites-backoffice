export enum DashboardPeriod {
  TwentyFourHours = "24h",
  Week = "week",
  ThreeMonths = "3months",
  Year = "year",
  AllTime = "all_time",
}

export const DASHBOARD_PERIOD_OPTIONS: {
  value: DashboardPeriod
  label: string
}[] = [
  { value: DashboardPeriod.TwentyFourHours, label: "Last 24 hours" },
  { value: DashboardPeriod.Week, label: "Last weeks" },
  { value: DashboardPeriod.ThreeMonths, label: "Last 3 months" },
  { value: DashboardPeriod.Year, label: "Last year" },
  { value: DashboardPeriod.AllTime, label: "All time" },
]
