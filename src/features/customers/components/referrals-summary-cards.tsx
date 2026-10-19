"use client"

import type { ReferralPlatformStats } from "@/features/customers/types"
import { formatCustomerCount } from "@/features/customers/utils/customer-format"
import { Icons } from "@/components/ui/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ReferralsSummaryCardsProps = {
  stats: ReferralPlatformStats
}

const CARDS: Array<{
  key: keyof Pick<
    ReferralPlatformStats,
    | "totalReferralsCount"
    | "fundedReferralsCount"
    | "platformActualPayoutsFormatted"
    | "platformExpectedPayoutsFormatted"
    | "platformTotalPotentialPayoutsFormatted"
  >
  label: string
  description: string
  isCount?: boolean
}> = [
  {
    key: "totalReferralsCount",
    label: "Total referrals",
    description: "Accounts created using a referral link",
    isCount: true,
  },
  {
    key: "fundedReferralsCount",
    label: "Funded referrals",
    description: "Referred users who deposited money",
    isCount: true,
  },
  {
    key: "platformActualPayoutsFormatted",
    label: "Actual payouts",
    description: "Money already earned or paid to referrers",
  },
  {
    key: "platformExpectedPayoutsFormatted",
    label: "Expected payouts",
    description: "Pending rewards for unfunded referrals",
  },
  {
    key: "platformTotalPotentialPayoutsFormatted",
    label: "Total potential payouts",
    description: "Maximum cost if every referral funds",
  },
]

export function ReferralsSummaryCards({ stats }: ReferralsSummaryCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className="rounded-2xl border border-border bg-background p-4"
        >
          <div className="flex items-center gap-1.5">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground/70 transition-colors hover:text-muted-foreground"
                  aria-label={`More info about ${card.label}`}
                >
                  <Icons.circleHelp className="size-3.5" aria-hidden />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">{card.description}</TooltipContent>
            </Tooltip>
          </div>
          <p className="mt-2 text-xl font-semibold text-foreground">
            {card.isCount
              ? formatCustomerCount(stats[card.key] as number)
              : stats[card.key]}
          </p>
        </div>
      ))}
    </div>
  )
}
