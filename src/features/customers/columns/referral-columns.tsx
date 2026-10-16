"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"

import type { ReferralSignup } from "@/features/customers/types"

export const referralColumns: ColumnDef<ReferralSignup>[] = [
  {
    accessorKey: "referrerName",
    header: "Referrer",
    cell: ({ row }) => {
      const referral = row.original

      if (!referral.referrerId) {
        return (
          <span className="font-medium text-foreground">
            {referral.referrerName}
          </span>
        )
      }

      return (
        <Link
          href={`/customers/${referral.referrerId}`}
          className="font-medium text-foreground hover:text-primary"
        >
          {referral.referrerName}
        </Link>
      )
    },
  },
  {
    accessorKey: "referredName",
    header: "Referred Customer",
    cell: ({ row }) => {
      const referral = row.original

      if (!referral.referredId) {
        return (
          <span className="font-medium text-foreground">
            {referral.referredName}
          </span>
        )
      }

      return (
        <Link
          href={`/customers/${referral.referredId}`}
          className="font-medium text-foreground hover:text-primary"
        >
          {referral.referredName}
        </Link>
      )
    },
  },
  {
    accessorKey: "referredEmail",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.referredEmail}</span>
    ),
  },
  {
    accessorKey: "referredPhone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.referredPhone}
      </span>
    ),
  },
  {
    accessorKey: "signedUpAt",
    header: "Signup Date",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {row.original.signedUpAt}
      </span>
    ),
  },
]
