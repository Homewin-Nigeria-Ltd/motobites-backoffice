export const salesExecutiveStatuses = [
  "personal_details",
  "verification_details",
  "under_review",
  "approved",
  "rejected",
] as const

export type SalesExecutiveStatus = (typeof salesExecutiveStatuses)[number]

export type SalesExecutiveReviewStatus = "approved" | "rejected"

export type SalesExecutive = {
  id: number
  userId: number
  name: string
  email: string
  phone: string
  phoneVerified: boolean
  referralCode: string
  status: string
  idType: string
  idNumber: string
  idDocumentUrl: string
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
  reviewNotes: string
  createdAt: string
}

export type SalesExecutiveListParams = {
  page: number
  per_page?: number
  status?: SalesExecutiveStatus
}

export type SalesExecutiveStatusCounts = Record<
  "all" | SalesExecutiveStatus,
  number
>

export type SalesExecutiveListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
  status_counts: SalesExecutiveStatusCounts
}

export type ApiSalesExecutiveUser = {
  id?: number
  name?: string
  email?: string
  phone?: string | null
  phone_verified_at?: string | null
  referral_code?: string | null
  status?: string | null
}

export type ApiSalesExecutiveProfile = {
  status?: string
  id_type?: string | null
  id_number?: string | null
  bank_name?: string | null
  bank_account_number?: string | null
  bank_account_name?: string | null
  review_notes?: string | null
}

export type ApiSalesExecutive = {
  id: number
  user_id?: number
  status?: string
  application_status?: string
  status_label?: string
  name?: string
  email?: string
  phone?: string | null
  referral_code?: string | null
  id_type?: string | null
  id_number?: string | null
  id_document_url?: string | null
  bank_name?: string | null
  bank_account_number?: string | null
  bank_account_name?: string | null
  review_notes?: string | null
  created_at?: string
  joined_at?: string
  user?: ApiSalesExecutiveUser | null
  sales_executive_profile?: ApiSalesExecutiveProfile | null
  profile?: ApiSalesExecutiveProfile | null
}

export type ApiSalesExecutiveListResponse = {
  data: ApiSalesExecutive[]
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
  meta?: {
    status_counts?: Partial<SalesExecutiveStatusCounts>
  }
}

export type ReviewSalesExecutiveInput = {
  id: number
  status: SalesExecutiveReviewStatus
  review_notes?: string
}

export const salesExecutivePeriods = [
  "24hrs",
  "7days",
  "last_month",
  "this_month",
  "custom",
] as const

export type SalesExecutivePeriod = (typeof salesExecutivePeriods)[number]

export const salesExecutiveAgentFilters = [
  "all",
  "behind_pace",
  "new_this_week",
  "no_signups_7_days",
  "suspended",
] as const

export type SalesExecutiveAgentFilter =
  (typeof salesExecutiveAgentFilters)[number]

export type SalesExecutiveAgent = {
  id: number
  name: string
  code: string
  joinedAt: string
  signedUp: number
  qualified: number
  target: number
  lastSignup: string
  pace: string
  status: string
}

export type SalesExecutiveAlert = {
  key: string
  title: string
  body: string
  tone: string
}

export type SalesExecutiveOverview = {
  title: string
  campaignNote: string
  qualifiedUsers: number
  qualifiedChangePercent: number
  qualifiedComparison: string
  signedUp: number
  notQualified: number
  activeAgents: number
  joinedThisWeek: number
  periodPayLabel: string
  payNote: string
  targetLabel: string
  targetQualified: number
  targetGoal: number
  targetRemaining: number
  targetProjected: number
  alerts: SalesExecutiveAlert[]
  agents: SalesExecutiveAgent[]
  race: SalesExecutiveAgent[]
}

export type SalesExecutiveAgentsResponse = {
  items: SalesExecutiveAgent[]
  total: number
  active: number
  counts: Record<SalesExecutiveAgentFilter, number>
}

export type SalesExecutiveTargetRow = {
  id: number
  name: string
  code: string
  previousQualified: number
  previousTarget: number
  target: number
  setBy: string
  setAt: string
}

export type SalesExecutiveTargetsResponse = {
  month: string
  monthLabel: string
  missingCount: number
  activeCount: number
  shown: number
  total: number
  firstMonthAverage: number
  agents: SalesExecutiveTargetRow[]
}

export type SalesExecutiveReferral = {
  name: string
  phone: string
  signedUp: string
  walletFunded: string
  qualified: boolean
  earned: string
}

export type SalesExecutiveActivity = {
  text: string
  note: string
  at: string
}

export type SalesExecutiveRaceLeader = {
  id: number
  name: string
  qualified: number
}

export type SalesExecutiveAgentDetail = {
  id: number
  name: string
  code: string
  status: string
  since: string
  signedUp: number
  qualified: number
  qualifiedPercent: number
  periodPay: string
  periodPayNote: string
  earnedTotal: string
  earnedNote: string
  targetQualified: number
  targetGoal: number
  targetPace: string
  targetNote: string
  raceQualified: number
  raceGoal: number
  racePlace: number
  raceTotal: number
  raceLeaders: SalesExecutiveRaceLeader[]
  raceNote: string
  referrals: SalesExecutiveReferral[]
  referralsPage: number
  referralsLastPage: number
  promoCode: string
  userId: string
  staffId: string
  phone: string
  email: string
  paidThrough: string
  activity: SalesExecutiveActivity[]
}

export type SetSalesExecutiveTargetsInput = {
  month: string
  agent_id?: number
  all_agents?: boolean
  target: number
  note?: string
}

export type UpdateSalesExecutiveStatusInput = {
  id: number
  status: "active" | "suspended"
}
