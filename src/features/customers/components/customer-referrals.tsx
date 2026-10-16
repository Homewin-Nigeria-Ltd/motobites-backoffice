import Link from "next/link"

import type { CustomerDetail } from "@/features/customers/types"

type CustomerReferralsProps = {
  customer: CustomerDetail
}

export function CustomerReferrals({ customer }: CustomerReferralsProps) {
  if (customer.referrals.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No referred customers yet.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="py-2 pr-4 font-medium">Name</th>
            <th className="py-2 pr-4 font-medium">Email</th>
            <th className="py-2 pr-4 font-medium">Phone</th>
            <th className="py-2 font-medium">Signup Date</th>
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
              <td className="py-3 text-muted-foreground">
                {referral.signedUpAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
