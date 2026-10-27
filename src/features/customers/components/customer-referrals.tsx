import Link from "next/link"

import { ReferralFundedBadge } from "@/features/customers/components/referral-funded-badge"
import type { CustomerDetail } from "@/features/customers/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CustomerReferralsProps = {
  customer: CustomerDetail
  fundedAmount: string
  onFundedAmountChange: (value: string) => void
  isFiltering?: boolean
}

export function CustomerReferrals({
  customer,
  fundedAmount,
  onFundedAmountChange,
  isFiltering = false,
}: CustomerReferralsProps) {
  const stats = customer.referralStats
  const hasAmountFilter = fundedAmount.trim().length > 0

  return (
    <div className="space-y-6">
      <div className="max-w-xs space-y-2">
        <Label htmlFor="referral-funded-amount">Funded amount</Label>
        <Input
          id="referral-funded-amount"
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="10000"
          value={fundedAmount}
          onChange={(event) => onFundedAmountChange(event.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">Total referrals</p>
          <p className="mt-1 font-medium text-foreground">
            {stats.totalReferralsCount.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Funded referrals</p>
          <p className="mt-1 font-medium text-foreground">
            {stats.fundedReferralsCount.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Actual earnings</p>
          <p className="mt-1 font-medium text-foreground">
            {stats.referrerActualEarningsFormatted}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Expected earnings</p>
          <p className="mt-1 font-medium text-foreground">
            {stats.referrerExpectedEarningsFormatted}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total potential earnings</p>
          <p className="mt-1 font-medium text-foreground">
            {stats.referrerTotalPotentialEarningsFormatted}
          </p>
        </div>
      </div>

      {isFiltering ? (
        <p className="text-sm text-muted-foreground">Updating referrals...</p>
      ) : null}

      {customer.referrals.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {hasAmountFilter
            ? "No referrals have funded this amount."
            : "No referred customers yet."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Phone</th>
                <th className="py-2 pr-4 font-medium">Signup Date</th>
                <th className="py-2 pr-4 font-medium">Funded</th>
                <th className="py-2 pr-4 font-medium">Amount funded</th>
                <th className="py-2 font-medium">Referrer earnings</th>
              </tr>
            </thead>
            <tbody>
              {customer.referrals.map((referral) => (
                <tr key={referral.id} className="border-b border-border/60">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/customers/${referral.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {referral.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {referral.email}
                  </td>
                  <td className="py-3 pr-4 text-foreground">{referral.phone}</td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {referral.signedUpAt}
                  </td>
                  <td className="py-3 pr-4">
                    <ReferralFundedBadge funded={referral.hasFunded} />
                  </td>
                  <td className="py-3 pr-4 text-foreground">
                    {referral.totalFundedAmountFormatted}
                  </td>
                  <td className="py-3 text-foreground">
                    {referral.referrerEarningsFormatted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
