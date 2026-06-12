import { CustomerDetailBlock } from "@/features/customers/components/customer-detail-block"
import { CustomerTransactionHistory } from "@/features/customers/components/customer-transaction-history"
import type { CustomerDetail } from "@/features/customers/types"
import { Button } from "@/components/ui/button"

type CustomerTransactionHistorySectionProps = {
  customer: CustomerDetail
}

export function CustomerTransactionHistorySection({
  customer,
}: CustomerTransactionHistorySectionProps) {
  return (
    <CustomerDetailBlock
      title="Transaction History"
      description="View user's personal information here."
      plain
      headerAction={
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-sm font-medium text-primary"
        >
          View all
        </Button>
      }
    >
      <CustomerTransactionHistory transactions={customer.transactions} />
    </CustomerDetailBlock>
  )
}
