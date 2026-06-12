import { CustomerTransactionCard } from "@/features/customers/components/customer-transaction-card"
import type { CustomerTransaction } from "@/features/customers/types"
import { Icons } from "@/components/ui/icons"

type CustomerTransactionHistoryProps = {
  transactions: CustomerTransaction[]
}

export function CustomerTransactionHistory({
  transactions,
}: CustomerTransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <p className="py-2 text-sm text-muted-foreground">
        No recent orders yet.
      </p>
    )
  }

  return (
    <div className="space-y-12 py-1 pr-1 md:space-y-14 md:py-2 md:pr-2">
      {transactions.map((transaction, index) => {
        const isLast = index === transactions.length - 1

        return (
          <div key={transaction.id} className="relative flex gap-5 md:gap-6">
            <div className="relative flex w-8 shrink-0 flex-col items-center">
              <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icons.check size={16} />
              </span>
              {!isLast ? (
                <span
                  className="absolute top-8 bottom-[-3rem] left-1/2 w-px -translate-x-1/2 bg-border"
                  aria-hidden
                />
              ) : null}
            </div>

            <CustomerTransactionCard transaction={transaction} />
          </div>
        )
      })}
    </div>
  )
}
