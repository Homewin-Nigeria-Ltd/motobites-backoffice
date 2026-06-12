import { CustomerAccountSummary } from "@/features/customers/components/customer-account-summary"
import { CustomerDetailBlock } from "@/features/customers/components/customer-detail-block"
import type { CustomerDetail } from "@/features/customers/types"

const SUBSCRIPTION_DESCRIPTION =
  "Details about the user's subscription plan, renewal date, and subscription history."

type CustomerAccountDetailsSectionProps = {
  customer: CustomerDetail
}

export function CustomerAccountDetailsSection({
  customer,
}: CustomerAccountDetailsSectionProps) {
  return (
    <CustomerDetailBlock
      title="Account Details"
      description={SUBSCRIPTION_DESCRIPTION}
      plain
    >
      <CustomerAccountSummary customer={customer} />
    </CustomerDetailBlock>
  )
}
