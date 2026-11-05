import type {
  SalesExecutiveAgent,
  SalesExecutiveAgentDetail,
  SalesExecutiveAgentsResponse,
  SalesExecutiveAlert,
  SalesExecutiveOverview,
  SalesExecutiveReferral,
  SalesExecutiveTargetRow,
  SalesExecutiveTargetsResponse,
} from "../types"
import { derivePace, formatNaira } from "./format"
import { asArray, asRecord, num, text } from "./read"

const paces = new Set(["behind", "on_track", "ahead", "no_target"])

function personName(value: unknown) {
  if (typeof value === "string") {
    return text(value, "")
  }

  const record = asRecord(value)
  return text(record?.name ?? record?.full_name, "")
}

function displayWhen(value: unknown, fallback = "—") {
  const raw = text(value, "")
  if (!raw) {
    return fallback
  }

  const parsed = Date.parse(
    raw.includes(" ") && !raw.includes("T") ? raw.replace(" ", "T") : raw
  )
  if (Number.isNaN(parsed)) {
    return raw
  }

  return new Date(parsed).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function optionalNum(value: unknown) {
  if (value == null || value === "") {
    return Number.NaN
  }

  return num(value, Number.NaN)
}

function money(formatted: unknown, amount: unknown) {
  const label = text(formatted, "")
  if (label) {
    return label
  }

  if (typeof amount === "number" && Number.isFinite(amount)) {
    return formatNaira(amount)
  }

  if (typeof amount === "string" && amount.trim()) {
    return formatNaira(num(amount))
  }

  return "—"
}

function monthHeading(value: unknown) {
  const raw = text(value, "")
  const match = raw.match(/^(\d{4})-(\d{2})/)
  if (!match) {
    return ""
  }

  return new Date(Number(match[1]), Number(match[2]) - 1, 1).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  )
}

function paceOf(record: Record<string, unknown>, qualified: number, target: number) {
  if (text(record.status, "") === "suspended") {
    return "suspended"
  }

  const pace = text(record.pace ?? record.pace_status, "")
  if (paces.has(pace)) {
    return pace
  }

  return derivePace(qualified, target, text(record.status, ""))
}

function mapAgent(
  value: unknown,
  score: "month" | "total" = "month"
): SalesExecutiveAgent | null {
  const record = asRecord(value)
  if (!record) {
    return null
  }

  const user = asRecord(record.user)
  const id = num(record.id ?? record.agent_id ?? user?.id)
  const monthQualified = record.month_qualified
  const totalQualified = num(
    record.qualified_users ??
      record.qualified ??
      record.qualified_referrals ??
      record.score ??
      record.total_qualified
  )
  const qualified =
    score === "month" && monthQualified != null ? num(monthQualified) : totalQualified
  const progress = asRecord(record.target_progress)
  const target = num(record.target ?? record.month_target ?? progress?.target)
  const name = text(record.name ?? user?.name, "Agent")

  return {
    id,
    name,
    code: text(
      record.code ?? record.referral_code ?? record.promo_code ?? user?.referral_code,
      ""
    ),
    joinedAt: displayWhen(record.joined_at ?? record.joined ?? record.joined_label),
    signedUp: num(record.signed_up ?? record.signups ?? record.signed_up_count),
    qualified,
    target,
    lastSignup: displayWhen(
      record.last_signup_at ?? record.last_signup ?? record.last_signup_label
    ),
    pace: paceOf(record, qualified, target),
    status: text(record.status, "active"),
  }
}

function byRank(values: unknown[]) {
  return [...values].sort((left, right) => {
    const leftRank = num(
      asRecord(left)?.rank ?? asRecord(left)?.place ?? asRecord(left)?.position,
      999
    )
    const rightRank = num(
      asRecord(right)?.rank ?? asRecord(right)?.place ?? asRecord(right)?.position,
      999
    )
    return leftRank - rightRank
  })
}

function watchTitle(key: string) {
  switch (key) {
    case "behind_pace":
      return "Behind pace"
    case "no_signups_7_days":
      return "No signups in 7 days"
    case "new_this_week":
      return "New this week"
    case "next_month_targets_not_set":
      return "Next month targets"
    default:
      return ""
  }
}

function watchTone(key: string, count: number) {
  if (count <= 0) {
    return "neutral"
  }

  if (key === "new_this_week") {
    return "info"
  }

  return "warning"
}

function watchNames(value: unknown) {
  return asArray(value)
    .map((agent) => text(asRecord(agent)?.name, ""))
    .filter(Boolean)
}

function mapAlert(value: unknown): SalesExecutiveAlert | null {
  if (typeof value === "string" && value.trim()) {
    return { key: value.trim(), title: value.trim(), body: "", tone: "info" }
  }

  const record = asRecord(value)
  if (!record) {
    return null
  }

  const key = text(record.key, "")
  const message = text(record.message ?? record.body ?? record.description, "")
  const title = text(record.title, "") || watchTitle(key) || message
  if (!title) {
    return null
  }

  const names = [...watchNames(record.agents), ...watchNames(record.agents_without_target)]
  const explicitTone = text(record.tone ?? record.type, "")

  return {
    key: key || title,
    title,
    body: [message !== title ? message : "", names.join(", ")].filter(Boolean).join(" "),
    tone:
      explicitTone ||
      (record.count == null ? "info" : watchTone(key, num(record.count))),
  }
}

function envelope(payload: unknown) {
  const root = asRecord(payload) ?? {}
  const data = asRecord(root.data)
  if (
    data &&
    ("summary" in data ||
      "target" in data ||
      "agents" in data ||
      "race" in data ||
      "profile" in data ||
      "period" in data)
  ) {
    return { root, body: data }
  }

  return { root, body: root }
}

export function mapSalesExecutiveOverview(payload: unknown): SalesExecutiveOverview {
  const { root, body } = envelope(payload)
  const summary = asRecord(body.summary) ?? asRecord(root.summary) ?? {}
  const target = asRecord(body.target) ?? asRecord(root.target) ?? {}
  const period = asRecord(body.period) ?? asRecord(root.period)
  const qualified = num(
    summary.qualified_users ?? summary.qualified ?? summary.qualified_referrals
  )
  const goal = num(target.goal ?? target.target)
  const rawAgents = asArray(body.agents ?? root.agents)
  const agents = rawAgents
    .map((agent) => mapAgent(agent, "month"))
    .filter((agent): agent is SalesExecutiveAgent => agent !== null)
  const race = byRank(asArray(body.race ?? root.race))
    .map((agent) => mapAgent(agent, "total"))
    .filter((agent): agent is SalesExecutiveAgent => agent !== null)
  const targetMonth = monthHeading(target.month ?? period?.from)
  const watch = asArray(body.watch_these ?? root.watch_these)
  const newThisWeek = asRecord(
    watch.find((item) => asRecord(item)?.key === "new_this_week")
  )

  return {
    title: text(period?.label ?? body.period_label ?? root.period_label, ""),
    campaignNote: text(
      period?.campaign_note ??
        body.campaign_note ??
        period?.ends_label ??
        summary.campaign_note,
      ""
    ),
    qualifiedUsers: qualified,
    qualifiedChangePercent: num(
      summary.qualified_users_change_percent ??
        summary.change_percent ??
        summary.qualified_change_percent,
      Number.NaN
    ),
    qualifiedComparison: text(
      summary.qualified_users_comparison ?? summary.comparison ?? summary.comparison_label,
      ""
    ),
    signedUp: num(summary.signed_up ?? summary.signups ?? summary.signed_up_count),
    notQualified: num(summary.not_qualified ?? summary.not_qualified_yet),
    activeAgents: num(summary.active_agents ?? summary.active_agent_count),
    joinedThisWeek: newThisWeek
      ? num(newThisWeek.count)
      : num(
          summary.joined_this_week ?? summary.new_this_week,
          rawAgents.filter((agent) => asRecord(agent)?.new_this_week === true).length
        ),
    periodPayLabel: money(
      summary.period_pay_formatted ?? summary.pay_formatted,
      typeof summary.earned === "number"
        ? summary.earned
        : summary.period_pay ?? summary.pay ?? summary.added_to_pay
    ),
    payNote: text(summary.pay_note ?? summary.period_pay_note, ""),
    targetLabel: text(
      target.label,
      targetMonth ? `${targetMonth.split(" ")[0]} target, all agents` : ""
    ),
    targetQualified: num(target.qualified_users ?? target.qualified ?? qualified),
    targetGoal: goal,
    targetRemaining: num(
      target.remaining,
      goal > 0 ? Math.max(goal - num(target.qualified_users ?? target.qualified ?? qualified), 0) : 0
    ),
    targetProjected: num(target.pace ?? target.projected ?? target.on_pace_for ?? target.on_pace),
    alerts: asArray(
      body.watch_these ?? root.watch_these ?? body.alerts ?? root.alerts ?? body.watch
    )
      .map(mapAlert)
      .filter((alert): alert is SalesExecutiveAlert => alert !== null),
    agents,
    race,
  }
}

export function mapSalesExecutiveAgents(payload: unknown): SalesExecutiveAgentsResponse {
  const root = asRecord(payload) ?? {}
  const nested = asRecord(root.data)
  const items = Array.isArray(root.data)
    ? root.data
    : Array.isArray(nested?.data)
      ? nested.data
      : asArray(nested?.agents ?? root.agents)
  const meta = asRecord(root.meta) ?? asRecord(nested?.meta) ?? {}
  const counts =
    asRecord(root.counts) ??
    asRecord(nested?.counts) ??
    asRecord(meta.counts) ??
    {}

  const mapped = items
    .map((agent) => mapAgent(agent, "month"))
    .filter((agent): agent is SalesExecutiveAgent => agent !== null)
  const activeOnPage = items.filter((agent) => asRecord(agent)?.active === true).length

  return {
    items: mapped,
    total: num(meta.total ?? root.total ?? nested?.total, mapped.length),
    active: num(meta.active ?? counts.active ?? nested?.active, activeOnPage),
    counts: {
      all: optionalNum(counts.all),
      behind_pace: optionalNum(counts.behind_pace),
      new_this_week: optionalNum(counts.new_this_week),
      no_signups_7_days: optionalNum(counts.no_signups_7_days),
      suspended: optionalNum(counts.suspended),
    },
  }
}

function mapTargetRow(value: unknown): SalesExecutiveTargetRow | null {
  const record = asRecord(value)
  if (!record) {
    return null
  }

  const previous = asRecord(record.previous) ?? asRecord(record.previous_month) ?? {}
  const setter = record.set_by ?? record.setter ?? record.target_set_by ?? previous.set_by

  return {
    id: num(record.id ?? record.agent_id),
    name: text(record.name ?? asRecord(record.user)?.name, "Agent"),
    code: text(record.code ?? record.referral_code ?? record.promo_code, ""),
    previousQualified: num(
      record.previous_qualified ??
        record.previous_month_qualified ??
        previous.qualified ??
        previous.qualified_referrals
    ),
    previousTarget: num(
      record.previous_target ?? record.previous_month_target ?? previous.target
    ),
    target: optionalNum(record.target ?? record.month_target),
    setBy: personName(setter),
    setAt: displayWhen(record.set_at ?? record.set_on ?? record.updated_at, ""),
  }
}

export function mapSalesExecutiveTargets(payload: unknown): SalesExecutiveTargetsResponse {
  const root = asRecord(payload) ?? {}
  const nested = asRecord(root.data)
  const rows = Array.isArray(root.data)
    ? root.data
    : Array.isArray(nested?.data)
      ? nested.data
      : asArray(nested?.agents ?? root.agents ?? nested?.targets ?? root.targets)
  const source = nested ?? root
  const summary = asRecord(root.summary) ?? asRecord(source.summary) ?? {}
  const meta = asRecord(root.meta) ?? asRecord(nested?.meta) ?? {}
  const mapped = rows
    .map(mapTargetRow)
    .filter((row): row is SalesExecutiveTargetRow => row !== null)
  const missing = mapped.filter((row) => !Number.isFinite(row.target)).length
  const monthValue = text(source.month ?? root.month, "")

  return {
    month: monthValue,
    monthLabel: text(source.month_label ?? source.label, monthHeading(monthValue)),
    missingCount: num(
      summary.untargeted_agents ?? source.untargeted_agents ?? source.missing_target_count ?? source.without_target,
      missing
    ),
    activeCount: num(
      summary.active_agents ?? source.active_count ?? source.active_agents,
      mapped.length
    ),
    shown: num(meta.to ?? source.shown, mapped.length),
    total: num(meta.total ?? source.total, mapped.length),
    firstMonthAverage: num(source.first_month_average, Number.NaN),
    agents: mapped,
  }
}

function mapReferral(value: unknown): SalesExecutiveReferral | null {
  const record = asRecord(value)
  if (!record) {
    return null
  }

  const qualified = record.qualified ?? record.is_qualified ?? record.qualification_status
  const isQualified =
    qualified === true ||
    qualified === 1 ||
    qualified === "qualified" ||
    qualified === "yes"

  return {
    name: text(record.name ?? record.user_name ?? asRecord(record.user)?.name, "User"),
    phone: text(record.phone ?? record.masked_phone ?? record.phone_masked, ""),
    signedUp: displayWhen(record.signed_up_at ?? record.signed_up ?? record.joined_at),
    walletFunded: money(
      record.wallet_funded_formatted,
      record.wallet_funded ?? record.funded_amount ?? record.deposit_amount
    ),
    qualified: isQualified,
    earned: money(
      record.earned_formatted,
      record.earned ?? record.earned_amount ?? record.reward
    ),
  }
}

function referralList(value: unknown) {
  if (Array.isArray(value)) {
    return { items: value, page: 1, lastPage: 1 }
  }

  const record = asRecord(value)
  const items = Array.isArray(record?.data) ? record.data : []
  const meta = asRecord(record?.meta) ?? {}

  return {
    items,
    page: num(record?.current_page ?? meta.current_page, 1),
    lastPage: num(record?.last_page ?? meta.last_page, 1),
  }
}

function mapRaceLeaders(value: unknown) {
  return asArray(value)
    .map((item) => {
      const record = asRecord(item)
      if (!record) {
        return null
      }

      const name = text(record.name, "")
      const id = num(record.agent_id ?? record.id)
      if (!id && !name) {
        return null
      }

      return {
        id,
        name: name || "Agent",
        qualified: num(record.qualified_users ?? record.qualified),
      }
    })
    .filter((item): item is SalesExecutiveAgentDetail["raceLeaders"][number] => item !== null)
}

export function mapSalesExecutiveAgentDetail(payload: unknown): SalesExecutiveAgentDetail {
  const { root, body } = envelope(payload)
  const agent = asRecord(body.agent) ?? asRecord(root.agent) ?? {}
  const profile = asRecord(body.profile) ?? asRecord(root.profile) ?? agent
  const summary = asRecord(body.summary) ?? asRecord(body.totals) ?? {}
  const target = asRecord(body.target) ?? asRecord(body.target_progress) ?? {}
  const race = asRecord(body.race) ?? {}
  const referralPage = referralList(body.referrals ?? root.referrals)
  const qualified = num(
    summary.qualified_users ?? summary.qualified ?? summary.qualified_referrals
  )
  const signedUp = num(summary.signups ?? summary.signed_up ?? body.signed_up)
  const activity = asArray(
    body.activity ?? body.target_activity ?? root.activity ?? root.target_activity
  )
  const setBy = text(target.set_by, "")
  const setAt = displayWhen(target.set_at, "")
  const targetNote = text(target.note ?? body.target_note, "")

  return {
    id: num(agent.id ?? body.id ?? profile.id ?? root.id),
    name: text(agent.name ?? body.name ?? profile.name, "Agent"),
    code: text(
      agent.referral_code ?? body.referral_code ?? profile.referral_code ?? profile.promo_code,
      ""
    ),
    status: text(agent.status ?? body.status ?? profile.status, "active"),
    since: displayWhen(
      agent.joined_at ?? body.joined_at ?? profile.joined_at ?? body.since ?? body.agent_since,
      ""
    ),
    signedUp,
    qualified,
    qualifiedPercent: num(
      summary.qualification_rate ?? summary.qualified_percent ?? body.qualified_percent,
      signedUp ? Math.round((qualified / signedUp) * 100) : 0
    ),
    periodPay: money(
      summary.period_pay_formatted ?? body.period_pay_formatted,
      typeof summary.earned === "number"
        ? summary.earned
        : summary.earned_this_month ?? summary.period_pay ?? body.period_pay
    ),
    periodPayNote: text(summary.period_pay_note ?? body.pay_note, ""),
    earnedTotal: money(
      summary.earned_total_formatted ?? body.earned_total_formatted,
      summary.earned_total ?? body.earned_total ?? summary.earned_referral_rewards
    ),
    earnedNote: text(summary.earned_note ?? body.earned_note, ""),
    targetQualified: num(target.qualified_users ?? target.qualified ?? body.month_qualified),
    targetGoal: num(
      target.target ?? target.goal ?? (typeof body.target === "number" ? body.target : undefined)
    ),
    targetPace: text(target.pace_status ?? target.pace, ""),
    targetNote:
      targetNote || (setBy ? `Set by ${setBy}${setAt ? `, ${setAt}` : ""}` : ""),
    raceQualified: num(race.qualified_users ?? race.qualified ?? body.race_qualified),
    raceGoal: num(race.target ?? race.goal),
    racePlace: num(race.rank ?? race.place ?? body.race_rank),
    raceTotal: num(race.total_agents),
    raceLeaders: mapRaceLeaders(race.leaders),
    raceNote: text(race.note ?? body.race_note, ""),
    referrals: referralPage.items
      .map(mapReferral)
      .filter((item): item is SalesExecutiveReferral => item !== null),
    referralsPage: referralPage.page,
    referralsLastPage: referralPage.lastPage,
    promoCode: text(
      agent.referral_code ?? profile.promo_code ?? profile.referral_code ?? body.referral_code,
      "—"
    ),
    userId: text(agent.id ?? body.id ?? profile.user_id ?? body.user_id, "-"),
    staffId: text(profile.staff_id ?? body.staff_id, "—"),
    phone: text(agent.phone ?? profile.phone ?? body.phone, "—"),
    email: text(agent.email ?? profile.email ?? body.email, "—"),
    paidThrough: text(profile.paid_through ?? body.paid_through, "—"),
    activity: activity
      .map((item) => {
        const record = asRecord(item)
        return {
          text: text(record?.description ?? record?.text ?? record?.message ?? item, ""),
          note: text(record?.note, ""),
          at: displayWhen(record?.created_at ?? record?.at, ""),
        }
      })
      .filter((item) => item.text),
  }
}
