"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { RiderProfileDocument } from "../components/rider-profile-document"
import { RiderProfileField } from "../components/rider-profile-field"
import { RiderReviewModal } from "../components/rider-review-modal"
import { RiderFormSection } from "../components/rider-form-section"
import { RiderStatusBadge } from "../components/rider-status-badge"
import { useRiderDetail } from "../hooks/use-rider-detail"
import {
  formatRiderDateOfBirth,
  formatRiderDisplayValue,
  formatRiderGender,
  splitGuarantorName,
} from "../utils/format-rider-profile"
import { canReviewRider } from "../utils/rider-review"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { getUserInitials } from "@/utils/get-initials"

type RiderProfileSectionProps = {
  riderId: string
}

export function RiderProfileSection({ riderId }: RiderProfileSectionProps) {
  const { data: rider, isPending, isError } = useRiderDetail(riderId)
  const [reviewOpen, setReviewOpen] = useState(false)

  const guarantor = useMemo(
    () => splitGuarantorName(rider?.profile.guarantor_name),
    [rider?.profile.guarantor_name]
  )

  if (isPending) {
    return <AppLoader className="flex-1 bg-muted p-12" />
  }

  if (isError || !rider) {
    return (
      <div className="flex flex-1 items-center justify-center bg-muted p-6 text-sm text-destructive">
        Could not load rider profile.
      </div>
    )
  }

  const showReviewActions = canReviewRider(rider)

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" className="shrink-0" asChild>
            <Link href="/riders" aria-label="Back to riders">
              <Icons.chevronLeft size={20} />
            </Link>
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-foreground">
                {rider.name}
              </h1>
              <RiderStatusBadge status={rider.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              View rider profile and delivery information.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {showReviewActions ? (
            <Button
              type="button"
              className="shrink-0 rounded-xl"
              onClick={() => setReviewOpen(true)}
            >
              Approve or Decline
            </Button>
          ) : null}
          <Button
            asChild
            variant={showReviewActions ? "outline" : "default"}
            className="shrink-0 rounded-xl"
          >
            <Link href={`/riders/${rider.id}/edit`}>Edit Rider</Link>
          </Button>
        </div>
      </div>

      <RiderReviewModal
        riderId={rider.id}
        riderName={rider.name}
        open={reviewOpen}
        onOpenChange={setReviewOpen}
      />

      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <RiderFormSection
          title="Profile photo"
          description="This image is displayed on the rider profile."
        >
          <div className="relative inline-flex">
            <Avatar className="size-28 rounded-full border-4 border-background shadow-sm">
              {rider.profile.avatar ? (
                <AvatarImage src={rider.profile.avatar} alt={rider.name} />
              ) : null}
              <AvatarFallback className="rounded-full bg-secondary text-2xl font-semibold text-primary">
                {getUserInitials(rider.name)}
              </AvatarFallback>
            </Avatar>
            {rider.onboarding_status === "approved" ? (
              <span className="absolute right-1 bottom-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background">
                <Icons.check size={14} />
              </span>
            ) : null}
          </div>
        </RiderFormSection>

        <RiderFormSection
          title="Personal Information"
          description="Rider personal details and contact information."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <RiderProfileField
              label="First name"
              value={formatRiderDisplayValue(rider.first_name)}
            />
            <RiderProfileField
              label="Last name"
              value={formatRiderDisplayValue(rider.last_name)}
            />
          </div>
          <RiderProfileField
            label="Email address"
            value={formatRiderDisplayValue(rider.email)}
          />
          <RiderProfileField
            label="Gender"
            value={formatRiderGender(rider.profile.gender)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <RiderProfileField
              label="Date of Birth"
              value={formatRiderDateOfBirth(rider.profile.date_of_birth)}
            />
            <RiderProfileField
              label="Contact Details"
              value={formatRiderDisplayValue(rider.phone)}
            />
          </div>
          <RiderProfileField
            label="Residents Address"
            value={formatRiderDisplayValue(rider.profile.house_address)}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Proof of Address</p>
            <p className="text-xs text-muted-foreground">
              Utility bills or other documents verifying the rider&apos;s
              residential address.
            </p>
            <RiderProfileDocument
              url={rider.profile.proof_of_address_url}
              uploadedAt={rider.updated_at}
            />
          </div>
        </RiderFormSection>

        <RiderFormSection
          title="Guarantor Information"
          description="Guarantor details provided during onboarding."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <RiderProfileField label="First name" value={guarantor.firstName} />
            <RiderProfileField label="Last name" value={guarantor.lastName} />
          </div>
          <RiderProfileField
            label="Email address"
            value={formatRiderDisplayValue(rider.profile.guarantor_email)}
          />
          <RiderProfileField
            label="Telephone"
            value={formatRiderDisplayValue(rider.profile.guarantor_phone)}
          />
          <RiderProfileField
            label="Relationship"
            value={formatRiderDisplayValue(rider.profile.guarantor_relationship)}
          />
          <RiderProfileField
            label="Residents Address"
            value={formatRiderDisplayValue(rider.profile.guarantor_address)}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Proof of Address</p>
            <RiderProfileDocument
              url={rider.profile.guarantor_proof_of_address_url}
              uploadedAt={rider.updated_at}
            />
          </div>
        </RiderFormSection>

        <RiderFormSection
          title="Identification Document"
          description="National identification and driver's license on file."
        >
          <RiderProfileField
            label="NIN"
            value={formatRiderDisplayValue(rider.profile.nin)}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Driver&apos;s License
            </p>
            <RiderProfileDocument
              url={rider.profile.driver_license_url}
              uploadedAt={rider.updated_at}
            />
          </div>
          {rider.profile.nin_document_url ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">NIN Document</p>
              <RiderProfileDocument
                url={rider.profile.nin_document_url}
                uploadedAt={rider.updated_at}
              />
            </div>
          ) : null}
        </RiderFormSection>

        <RiderFormSection
          title="Bank Account Details"
          description="Bank account information used for rider payouts."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <RiderProfileField
              label="Account Number"
              value={formatRiderDisplayValue(rider.profile.bank_account_number)}
            />
            <RiderProfileField
              label="Bank Name"
              value={formatRiderDisplayValue(rider.profile.bank_name)}
            />
          </div>
          <RiderProfileField
            label="Account Name"
            value={formatRiderDisplayValue(rider.profile.bank_account_name)}
          />
        </RiderFormSection>

        {rider.onboarding_status === "rejected" &&
        rider.profile.review_notes?.trim() ? (
          <RiderFormSection
            title="Review notes"
            description="Reason provided when this rider application was rejected."
          >
            <RiderProfileField
              label="Rejection reason"
              value={rider.profile.review_notes}
            />
          </RiderFormSection>
        ) : null}

        <RiderFormSection
          title="Chat with Rider"
          description="Have a conversation with the rider."
          className="pb-0"
        >
          <Link
            href={`/riders/chat?riderId=${rider.id}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                {rider.profile.avatar ? (
                  <AvatarImage src={rider.profile.avatar} alt={rider.name} />
                ) : null}
                <AvatarFallback className="bg-secondary text-sm font-semibold text-primary">
                  {getUserInitials(rider.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">
                Chat with {rider.first_name}
              </span>
            </div>
            <Icons.chevronRight size={18} className="text-muted-foreground" />
          </Link>
        </RiderFormSection>
      </div>
    </div>
  )
}
