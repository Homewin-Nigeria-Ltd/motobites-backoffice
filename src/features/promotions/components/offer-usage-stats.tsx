import type { OfferUsageTracking } from "@/features/promotions/types"
import { emptyOfferUsageTracking } from "@/features/promotions/utils/offer-form"

type OfferUsageStatsProps = {
  usage?: OfferUsageTracking | null
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value)
}

export function OfferUsageStats({ usage }: OfferUsageStatsProps) {
  const data = usage ?? emptyOfferUsageTracking

  const stats = [
    {
      label: "Times used",
      value: data.timesUsed.toLocaleString("en-US"),
    },
    {
      label: "Customers redeemed",
      value: data.customersRedeemed.toLocaleString("en-US"),
    },
    {
      label: "Total discounts given",
      value: formatMoney(data.totalDiscountGiven),
    },
    {
      label: "Remaining uses",
      value:
        data.remainingUses == null
          ? "No limit"
          : data.remainingUses.toLocaleString("en-US"),
    },
  ]

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        Usage tracking
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-background px-4 py-4"
          >
            <p className="text-xs font-medium text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
