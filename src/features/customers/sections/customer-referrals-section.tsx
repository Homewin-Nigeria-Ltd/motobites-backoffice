import { CustomerDetailBlock } from "@/features/customers/components/customer-detail-block"
import { CustomerReferrals } from "@/features/customers/components/customer-referrals"
import type { CustomerDetail } from "@/features/customers/types"

type CustomerReferralsSectionProps = {
  customer: CustomerDetail
}

export function CustomerReferralsSection({
  customer,
}: CustomerReferralsSectionProps) {
  return (
    <CustomerDetailBlock
      title="Referrals"
      description={`${customer.referralStats.totalReferralsCount.toLocaleString()} customer${customer.referralStats.totalReferralsCount === 1 ? "" : "s"} signed up through this customer.`}
    >
      <CustomerReferrals customer={customer} />
    </CustomerDetailBlock>
  )
}
