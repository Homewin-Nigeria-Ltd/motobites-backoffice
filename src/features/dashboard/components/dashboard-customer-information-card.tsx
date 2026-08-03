"use client"

import type { DashboardCustomerInformation } from "@/features/dashboard/types"
import {
  formatAcquisitionSourceLabel,
  formatPreferredPaymentMethod,
} from "@/features/dashboard/utils/acquisition-source"
import { formatDashboardCount } from "@/features/dashboard/utils/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/utils/date"

type DashboardCustomerInformationCardProps = {
  customerInformation: DashboardCustomerInformation
}

function displayValue(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return "—"
  }

  return String(value)
}

function formatOptionalDate(value?: string | null) {
  if (!value) {
    return "—"
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return formatDate(value)
}

export function DashboardCustomerInformationCard({
  customerInformation,
}: DashboardCustomerInformationCardProps) {
  const customers = customerInformation.recent_customers ?? []

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="flex flex-row items-start justify-between gap-4 px-5 pb-0">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Customer Information
          </CardTitle>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            {formatDashboardCount(customerInformation.total_customers)}{" "}
            <span className="text-lg font-medium text-muted-foreground">
              Customers
            </span>
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        {customers.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">
            No recent customers for this period.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-y border-border text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Delivery Address</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium">Orders</th>
                  <th className="px-5 py-3 font-medium">Lifetime Value</th>
                  <th className="px-5 py-3 font-medium">Avg Order</th>
                  <th className="px-5 py-3 font-medium">Last Order</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr
                    key={String(customer.id ?? `${customer.email}-${index}`)}
                    className="border-b border-border/70 last:border-b-0"
                  >
                    <td className="px-5 py-3 align-top">
                      <p className="font-medium text-foreground">
                        {displayValue(customer.name)}
                      </p>
                    </td>
                    <td className="px-5 py-3 align-top">
                      <p className="text-foreground">
                        {displayValue(customer.email)}
                      </p>
                      <p className="text-muted-foreground">
                        {displayValue(customer.phone)}
                      </p>
                    </td>
                    <td className="max-w-[14rem] px-5 py-3 align-top text-foreground wrap-break-word">
                      {displayValue(customer.delivery_address)}
                    </td>
                    <td className="px-5 py-3 align-top text-foreground whitespace-nowrap">
                      {formatOptionalDate(
                        customer.date_joined ?? customer.joined_at,
                      )}
                    </td>
                    <td className="px-5 py-3 align-top text-foreground">
                      {formatDashboardCount(customer.total_orders ?? 0)}
                    </td>
                    <td className="px-5 py-3 align-top text-foreground whitespace-nowrap">
                      {displayValue(customer.lifetime_value_formatted)}
                    </td>
                    <td className="px-5 py-3 align-top text-foreground whitespace-nowrap">
                      {displayValue(customer.average_order_value_formatted)}
                    </td>
                    <td className="px-5 py-3 align-top text-foreground whitespace-nowrap">
                      {formatOptionalDate(customer.last_order_date)}
                    </td>
                    <td className="px-5 py-3 align-top text-foreground">
                      {formatPreferredPaymentMethod(
                        customer.preferred_payment_method,
                      )}
                    </td>
                    <td className="px-5 py-3 align-top text-foreground">
                      {formatAcquisitionSourceLabel(
                        customer.acquisition_source,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
