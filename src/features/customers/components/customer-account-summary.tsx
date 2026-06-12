import type { CustomerDetail } from "@/features/customers/types"

const SECTION_DESCRIPTION =
  "Details about the user's subscription plan, renewal date, and subscription history."

type CustomerAccountSummaryProps = {
  customer: CustomerDetail
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

      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-semibold text-foreground">
            Number of Orders
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {SECTION_DESCRIPTION}
          </p>
        </div>
        <p className="shrink-0 text-sm font-medium text-foreground md:text-base">
          {customer.ordersCount.toLocaleString()} Orders
        </p>
      </div>
    </div>
  )
}
