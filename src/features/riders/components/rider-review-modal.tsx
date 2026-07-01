"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { useUpdateRiderStatus } from "../hooks/use-update-rider-status"
import {
  rejectRiderSchema,
  type RejectRiderFormValues,
} from "../schemas/rider-status.schema"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

type ReviewStep = "choose" | "approve" | "reject"

type RiderReviewModalProps = {
  riderId: number
  riderName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RiderReviewModal({
  riderId,
  riderName,
  open,
  onOpenChange,
}: RiderReviewModalProps) {
  const [step, setStep] = useState<ReviewStep>("choose")
  const { approveRider, rejectRider, isPending } = useUpdateRiderStatus()

  const form = useForm<RejectRiderFormValues>({
    resolver: zodResolver(rejectRiderSchema),
    defaultValues: {
      review_notes: "",
    },
  })

  function resetReviewState() {
    setStep("choose")
    form.reset({ review_notes: "" })
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetReviewState()
    }
    onOpenChange(nextOpen)
  }

  async function handleApprove() {
    await approveRider(riderId)
    handleOpenChange(false)
  }

  async function handleReject(values: RejectRiderFormValues) {
    await rejectRider(riderId, values.review_notes.trim())
    handleOpenChange(false)
  }

  const title =
    step === "choose"
      ? "Rider Approval"
      : step === "approve"
        ? "Confirm Approval"
        : "Decline Rider"

  return (
    <BaseModal
      title={title}
      className="max-w-lg"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {step === "choose" ? (
        <div className="space-y-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Approve or decline{" "}
            <span className="font-medium text-foreground">{riderName}</span> as a
            rider.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setStep("reject")}
              disabled={isPending}
            >
              Decline
            </Button>
            <Button
              type="button"
              onClick={() => setStep("approve")}
              disabled={isPending}
            >
              Approve
            </Button>
          </div>
        </div>
      ) : step === "approve" ? (
        <div className="space-y-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Approve{" "}
            <span className="font-medium text-foreground">{riderName}</span>? They
            can start accepting deliveries once approved.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("choose")}
              disabled={isPending}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => void handleApprove()}
              disabled={isPending}
            >
              {isPending ? "Approving..." : "Approve Rider"}
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={form.handleSubmit(handleReject)}
          className="space-y-4"
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            Decline{" "}
            <span className="font-medium text-foreground">{riderName}</span>? Add
            a reason they will see on their application.
          </p>
          <Controller
            name="review_notes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="rider-review-notes">
                  Decline reason
                </FieldLabel>
                <Textarea
                  {...field}
                  id="rider-review-notes"
                  rows={4}
                  placeholder="Why is this rider being declined?"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("choose")}
              disabled={isPending}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? "Declining..." : "Decline Rider"}
            </Button>
          </div>
        </form>
      )}
    </BaseModal>
  )
}
