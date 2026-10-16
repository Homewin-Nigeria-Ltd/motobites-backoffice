import { formatDate } from "@/utils/date"

import type {
  ApiReferralListResponse,
  ApiReferredCustomer,
  ApiReferralSignup,
  CustomerReferral,
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
  }
}

export function mapApiReferralListResponse(response: ApiReferralListResponse) {
  return {
    items: (response.data ?? []).map(mapApiReferralSignup),
    meta: response.meta,
  }
}
