import { CustomerDetailBlock } from "@/features/customers/components/customer-detail-block"
import { CustomerReferrals } from "@/features/customers/components/customer-referrals"
import type { CustomerDetail } from "@/features/customers/types"

type CustomerReferralsSectionProps = {
  customer: CustomerDetail
  fundedAmount: string
  onFundedAmountChange: (value: string) => void
  isFiltering?: boolean
}

export function CustomerReferralsSection({
  customer,
  fundedAmount,
  onFundedAmountChange,
  isFiltering = false,
}: CustomerReferralsSectionProps) {
  return (
    <CustomerDetailBlock
      title="Referrals"
      description={`${customer.referralStats.totalReferralsCount.toLocaleString()} customer${customer.referralStats.totalReferralsCount === 1 ? "" : "s"} signed up through this customer.`}
    >
      <CustomerReferrals
        customer={customer}
        fundedAmount={fundedAmount}
        onFundedAmountChange={onFundedAmountChange}
        isFiltering={isFiltering}
      />
    </CustomerDetailBlock>
  )
}
