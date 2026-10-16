import type { CustomerListParams, ReferralListParams } from "../types"

export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (params: CustomerListParams) =>
    [...customerKeys.lists(), params] as const,
  overview: (branchId?: number | null) =>
    [...customerKeys.all, "overview", branchId] as const,
  referrals: (params: ReferralListParams) =>
    [...customerKeys.all, "referrals", params] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
}
