import { CustomerCnplSection } from "@/features/customers/components/customer-cnpl-section"
import { CustomerDetailBlock } from "@/features/customers/components/customer-detail-block"
import type { CustomerDetail } from "@/features/customers/types"

const SUBSCRIPTION_DESCRIPTION =
  "Details about the user's subscription plan, renewal date, and subscription history."

type CustomerChopNowPayLaterSectionProps = {
  customer: CustomerDetail
}

export function CustomerChopNowPayLaterSection({
  customer,
}: CustomerChopNowPayLaterSectionProps) {
  return (
    <CustomerDetailBlock
      title="Chop Now Pay Later"
      description={SUBSCRIPTION_DESCRIPTION}
      plain
    >
      <CustomerCnplSection
        overdraftBalanceFormatted={customer.overdraftBalanceFormatted}
        transactions={customer.cnplTransactions}
      />
    </CustomerDetailBlock>
  )
}
