import { formatNairaAmount } from "@/features/customers/utils/customer-format"
import { formatDate } from "@/utils/date"

import type {
  ApiCustomerReferralMeta,
  ApiReferralListResponse,
  ApiReferredCustomer,
  ApiReferralSignup,
  CustomerReferral,
  CustomerReferralStats,
  ReferralListMeta,
  ReferralPlatformStats,
  ReferralSignup,
} from "../types"

function formatReferredAt(value?: string | null) {
  if (!value?.trim()) {
    return "—"
  }

  if (Number.isNaN(Date.parse(value))) {
    return value
  }

  return formatDate(value)
}

function toAmount(value?: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0
}

function mapFunding(item: {
  has_funded?: boolean
  total_funded_amount?: number
  referrer_earnings?: number
}) {
  const totalFundedAmount = toAmount(item.total_funded_amount)
  const referrerEarnings = toAmount(item.referrer_earnings)

  return {
    hasFunded: Boolean(item.has_funded),
    totalFundedAmount,
    totalFundedAmountFormatted: formatNairaAmount(totalFundedAmount),
    referrerEarnings,
    referrerEarningsFormatted: formatNairaAmount(referrerEarnings),
  }
}

export function mapApiReferredCustomer(
  referral: ApiReferredCustomer,
  index: number
): CustomerReferral {
  return {
    id: referral.id != null ? String(referral.id) : String(index),
    name: referral.name || referral.email || "Customer",
    email: referral.email ?? "—",
    phone: referral.phone ?? "—",
    signedUpAt: formatReferredAt(referral.referred_at),
    ...mapFunding(referral),
  }
}

export function mapApiReferralSignup(
  referral: ApiReferralSignup
): ReferralSignup {
  return {
    id: String(referral.id),
    referrerId: referral.referrer?.id != null ? String(referral.referrer.id) : null,
    referrerName: referral.referrer?.name || referral.referrer?.email || "—",
    referredId: String(referral.id),
    referredName: referral.name || referral.email || "Customer",
    referredEmail: referral.email ?? "—",
    referredPhone: referral.phone ?? "—",
    signedUpAt: formatReferredAt(referral.referred_at),
    ...mapFunding(referral),
  }
}

export function mapReferralPlatformStats(
  meta?: ApiReferralListResponse["meta"]
): ReferralPlatformStats {
  const totalReferralsCount = meta?.total_referrals_count ?? meta?.total ?? 0
  const fundedReferralsCount = meta?.funded_referrals_count ?? 0
  const platformActualPayouts = toAmount(meta?.platform_actual_payouts)
  const platformExpectedPayouts = toAmount(meta?.platform_expected_payouts)
  const platformTotalPotentialPayouts = toAmount(
    meta?.platform_total_potential_payouts
  )

  return {
    totalReferralsCount,
    fundedReferralsCount,
    platformActualPayouts,
    platformActualPayoutsFormatted: formatNairaAmount(platformActualPayouts),
    platformExpectedPayouts,
    platformExpectedPayoutsFormatted: formatNairaAmount(platformExpectedPayouts),
    platformTotalPotentialPayouts,
    platformTotalPotentialPayoutsFormatted: formatNairaAmount(
      platformTotalPotentialPayouts
    ),
  }
}

export function mapApiReferralListResponse(
  response: ApiReferralListResponse
): { items: ReferralSignup[]; meta: ReferralListMeta } {
  const platformStats = mapReferralPlatformStats(response.meta)

  return {
    items: (response.data ?? []).map(mapApiReferralSignup),
    meta: {
      ...response.meta,
      ...platformStats,
    },
  }
}

export function emptyCustomerReferralStats(): CustomerReferralStats {
  return {
    totalReferralsCount: 0,
    fundedReferralsCount: 0,
    referrerActualEarnings: 0,
    referrerActualEarningsFormatted: formatNairaAmount(0),
    referrerExpectedEarnings: 0,
    referrerExpectedEarningsFormatted: formatNairaAmount(0),
    referrerTotalPotentialEarnings: 0,
    referrerTotalPotentialEarningsFormatted: formatNairaAmount(0),
  }
}

export function mapApiCustomerReferralStats(
  meta?: ApiCustomerReferralMeta,
  fallbackCount = 0
): CustomerReferralStats {
  const totalReferralsCount = meta?.total_referrals_count ?? fallbackCount
  const fundedReferralsCount = meta?.funded_referrals_count ?? 0
  const referrerActualEarnings = toAmount(meta?.referrer_actual_earnings)
  const referrerExpectedEarnings = toAmount(meta?.referrer_expected_earnings)
  const referrerTotalPotentialEarnings = toAmount(
    meta?.referrer_total_potential_earnings
  )

  return {
    totalReferralsCount,
    fundedReferralsCount,
    referrerActualEarnings,
    referrerActualEarningsFormatted: formatNairaAmount(referrerActualEarnings),
    referrerExpectedEarnings,
    referrerExpectedEarningsFormatted: formatNairaAmount(referrerExpectedEarnings),
    referrerTotalPotentialEarnings,
    referrerTotalPotentialEarningsFormatted: formatNairaAmount(
      referrerTotalPotentialEarnings
    ),
  }
}
