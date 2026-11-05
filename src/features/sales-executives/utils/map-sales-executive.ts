import { formatDate } from "@/utils/date"

import type { ApiSalesExecutive, SalesExecutive } from "../types"

function text(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : "—"
}

function formatCreatedAt(value?: string) {
  if (!value?.trim()) {
    return "—"
  }

  if (Number.isNaN(Date.parse(value))) {
    return value
  }

  return formatDate(value)
}

export function mapApiSalesExecutive(
  application: ApiSalesExecutive
): SalesExecutive {
  const user = application.user
  const profile =
    application.sales_executive_profile ?? application.profile ?? null

  return {
    id: application.id,
    userId: application.user_id ?? user?.id ?? application.id,
    name: text(user?.name ?? application.name),
    email: text(user?.email ?? application.email),
    phone: text(user?.phone ?? application.phone),
    phoneVerified: Boolean(user?.phone_verified_at),
    referralCode: text(user?.referral_code ?? application.referral_code),
    status:
      application.application_status ??
      application.status ??
      profile?.status ??
      "personal_details",
    idType: text(application.id_type ?? profile?.id_type),
    idNumber: text(application.id_number ?? profile?.id_number),
    idDocumentUrl: application.id_document_url?.trim() || "",
    bankName: text(application.bank_name ?? profile?.bank_name),
    bankAccountNumber: text(
      application.bank_account_number ?? profile?.bank_account_number
    ),
    bankAccountName: text(
      application.bank_account_name ?? profile?.bank_account_name
    ),
    reviewNotes: text(application.review_notes ?? profile?.review_notes),
    createdAt: formatCreatedAt(application.created_at ?? application.joined_at),
  }
}

export function formatSalesExecutiveStatus(status: string) {
  return status
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function canReviewSalesExecutive(status: string) {
  return status !== "approved" && status !== "rejected"
}
