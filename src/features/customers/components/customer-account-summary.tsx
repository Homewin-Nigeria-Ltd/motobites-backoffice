import type { CustomerDetail } from "@/features/customers/types"

type CustomerAccountSummaryProps = {
  customer: CustomerDetail
}

function formatPaymentMethod(method?: string | null) {
  if (!method) {
    return "—"
  }

  return method
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function AccountStat({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground md:text-base">
          {value}
        </p>
      </div>
      {description ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function CustomerAccountSummary({
  customer,
}: CustomerAccountSummaryProps) {
  return (
    <div className="grid gap-8 py-1 md:grid-cols-2 md:gap-12 md:py-2">
      <div className="flex flex-wrap items-baseline gap-2">
        <p className="text-sm text-muted-foreground">Wallet Balance</p>
        <p className="text-base font-semibold text-primary">
          {customer.walletBalanceFormatted}
        </p>
      </div>

      <AccountStat
        label="Number of Orders"
        value={`${customer.ordersCount.toLocaleString()} Orders`}
        description="Total completed and historical orders associated with this customer."
      />

      <AccountStat
        label="Lifetime Value"
        value={customer.lifetimeValueFormatted}
        description="Total amount spent by this customer across all orders."
      />

      <AccountStat
        label="Average Order Value"
        value={customer.averageOrderValueFormatted}
        description="Average spend per order based on the customer's order history."
      />

      <AccountStat
        label="Last Order Date"
        value={customer.lastOrderDate || "—"}
      />

      <AccountStat
        label="Preferred Payment Method"
        value={formatPaymentMethod(customer.preferredPaymentMethod)}
      />
    </div>
  )
}
