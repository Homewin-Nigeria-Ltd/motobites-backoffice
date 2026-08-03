"use client"

import type { DashboardCustomerBehaviour } from "@/features/dashboard/types"
import { formatDashboardCount } from "@/features/dashboard/utils/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DashboardCustomerBehaviourCardProps = {
  customerBehaviour: DashboardCustomerBehaviour
}

function formatRate(value?: number | string | null) {
  if (value === null || value === undefined || value === "") {
    return "—"
  }

  if (typeof value === "number") {
    return `${value}%`
  }

  const trimmed = String(value).trim()
  return trimmed.includes("%") ? trimmed : `${trimmed}%`
}

function Metric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  )
}

export function DashboardCustomerBehaviourCard({
  customerBehaviour,
}: DashboardCustomerBehaviourCardProps) {
  const dormant = customerBehaviour.dormant_customers ?? {}

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="px-5 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Customer Behaviour
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 px-5 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="New Customers"
          value={formatDashboardCount(customerBehaviour.new_customers)}
        />
        <Metric
          label="Returning Customers"
          value={formatDashboardCount(customerBehaviour.returning_customers)}
        />
        <Metric
          label="First-time Buyers"
          value={formatDashboardCount(customerBehaviour.first_time_buyers ?? 0)}
        />
        <Metric
          label="Repeat Purchase Rate"
          value={formatRate(customerBehaviour.repeat_purchase_rate)}
        />
        <Metric
          label="Retention Rate"
          value={formatRate(customerBehaviour.customer_retention_rate)}
        />
        <Metric
          label="Churn Rate"
          value={formatRate(customerBehaviour.churn_rate)}
        />
        <Metric
          label="Dormant (30 days)"
          value={formatDashboardCount(dormant["30_days"] ?? 0)}
        />
        <Metric
          label="Dormant (60 days)"
          value={formatDashboardCount(dormant["60_days"] ?? 0)}
        />
        <Metric
          label="Dormant (90 days)"
          value={formatDashboardCount(dormant["90_days"] ?? 0)}
        />
      </CardContent>
    </Card>
  )
}
