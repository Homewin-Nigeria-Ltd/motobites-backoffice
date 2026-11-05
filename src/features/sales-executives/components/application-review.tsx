"use client"

import { useState } from "react"

import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toast } from "@/lib/toast"

import { useReviewSalesExecutive } from "../hooks/use-review-sales-executive"
import { useSalesExecutive } from "../hooks/use-sales-executives"
import type { SalesExecutive } from "../types"

function known(value: string) {
  return Boolean(value && value !== "—")
}

function initials(name: string) {
  const parts = name.split(" ").filter((part) => part && part !== "—")
  const letters = `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
  return letters || "?"
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
      )}
    >
      {label}
    </span>
  )
}

export function ApplicationCard({
  application,
  actionable,
  onDecline,
  onApprove,
}: {
  application: SalesExecutive
  actionable: boolean
  onDecline: () => void
  onApprove: () => void
}) {
  const phoneOk = application.phoneVerified
  const idOk = known(application.idDocumentUrl) || known(application.idType)

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium">
          {initials(application.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium">{application.name}</p>
          <p className="truncate text-sm text-muted-foreground">
            Applied {application.createdAt}
            {known(application.email) ? ` · ${application.email}` : ""}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Check
          ok={phoneOk}
          label={phoneOk ? "Phone verified" : known(application.phone) ? "Phone not verified" : "No phone"}
        />
        <Check ok={idOk} label={idOk ? "ID looks right" : "No ID uploaded"} />
      </div>
      {actionable ? (
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="outline" onClick={onDecline}>
            Decline
          </Button>
          <Button type="button" onClick={onApprove}>
            Review and approve
          </Button>
        </div>
      ) : null}
    </article>
  )
}

function Row({
  label,
  value,
  detail,
  ok,
  okLabel,
  badLabel,
  onAction,
  actionLabel,
}: {
  label: string
  value: string
  detail: string
  ok: boolean
  okLabel: string
  badLabel: string
  onAction?: () => void
  actionLabel?: string
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-3 last:border-0">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
        <p className="text-sm text-muted-foreground">{detail}</p>
        {onAction && actionLabel ? (
          <button
            type="button"
            className="mt-1 text-sm font-medium text-primary"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      <Check ok={ok} label={ok ? okLabel : badLabel} />
    </div>
  )
}

export function ApplicationReviewDialogs({
  application,
  mode,
  onMode,
  onClose,
}: {
  application: SalesExecutive | null
  mode: "approve" | "id" | "decline" | null
  onMode: (mode: "approve" | "id" | "decline" | null) => void
  onClose: () => void
}) {
  const { review, isPending } = useReviewSalesExecutive()
  const detail = useSalesExecutive(application?.id ?? null)
  const current = detail.data ?? application
  const [reason, setReason] = useState("")

  if (!current || !mode) {
    return null
  }

  const phoneOk = current.phoneVerified
  const idOk = known(current.idDocumentUrl) || known(current.idType)
  const close = () => {
    setReason("")
    onClose()
  }

  const approve = async () => {
    await review({
      id: current.id,
      status: "approved",
    })
    close()
  }

  const decline = async () => {
    const reviewNotes = reason.trim()
    if (!reviewNotes) {
      toast.error("Add a reason so they can fix it and apply again.")
      return
    }
    await review({
      id: current.id,
      status: "rejected",
      review_notes: reviewNotes,
    })
    close()
  }

  const loading = detail.isPending && !detail.data

  return (
    <>
      <Dialog open={mode === "approve"} onOpenChange={(open) => !open && close()}>
        <DialogContent className="sm:max-w-2xl">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium">
              {initials(current.name)}
            </div>
            <div>
              <DialogTitle>Approve {current.name}?</DialogTitle>
              <DialogDescription>
                Applied {current.createdAt}. They get a promo code by email
                and text.
              </DialogDescription>
            </div>
          </div>
          {loading ? <AppLoader className="py-6" /> : null}
          {detail.isError ? (
            <p className="text-sm text-muted-foreground">
              Could not load the latest application.
            </p>
          ) : null}
          {loading ? null : (
          <div>
            <Row
              label="Phone"
              value={current.phone}
              detail={phoneOk ? "Code confirmed by text" : "Phone is not verified yet"}
              ok={phoneOk}
              okLabel="Verified"
              badLabel={known(current.phone) ? "Not verified" : "Missing"}
            />
            <Row
              label="ID"
              value={known(current.idType) ? current.idType : "No ID"}
              detail={
                known(current.idNumber)
                  ? current.idNumber
                  : idOk
                    ? "Uploaded with the application"
                    : "No photo uploaded"
              }
              ok={idOk}
              okLabel="Name matches"
              badLabel="Not uploaded"
              onAction={() => onMode("id")}
              actionLabel="View ID"
            />
          </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onMode("decline")}
            >
              Decline instead
            </Button>
            <Button type="button" disabled={isPending || loading} onClick={() => void approve()}>
              Approve and send code
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={mode === "id"} onOpenChange={(open) => !open && onMode("approve")}>
        <DialogContent className="sm:max-w-2xl">
          <DialogTitle>{current.name}&apos;s ID</DialogTitle>
          <DialogDescription>
            {known(current.idType)
              ? `${current.idType}. Only you and admin can see this photo.`
              : "Only you and admin can see this photo."}
          </DialogDescription>
          <div className="flex min-h-40 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted px-4 text-center text-sm text-muted-foreground">
            {loading ? (
              <AppLoader className="py-6" />
            ) : known(current.idDocumentUrl) ? (
              // The document URL comes from the application record.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.idDocumentUrl}
                alt={`${current.name} ID`}
                className="max-h-80 w-full object-contain"
              />
            ) : (
              "No ID photo uploaded."
            )}
          </div>
          <div>
            <Row
              label="Name"
              value={current.name}
              detail="Name on the application"
              ok={idOk}
              okLabel="Matches"
              badLabel="Missing"
            />
            <Row
              label="Photo"
              value={idOk ? "Uploaded" : "Not uploaded"}
              detail={idOk ? "Check that all four corners show" : "Ask them to upload a clear photo"}
              ok={idOk}
              okLabel="Clear"
              badLabel="Not clear"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onMode("decline")}>
              Photo not clear, decline
            </Button>
            <Button type="button" onClick={() => onMode("approve")}>
              Looks right, back to approve
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={mode === "decline"} onOpenChange={(open) => !open && close()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogTitle>Decline {current.name}?</DialogTitle>
          <DialogDescription>
            They see this reason, so they can fix it and apply again.
          </DialogDescription>
          <Textarea
            value={reason}
            maxLength={2000}
            placeholder="Reason"
            onChange={(event) => setReason(event.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onMode("approve")}>
              Back
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending || loading}
              onClick={() => void decline()}
            >
              Decline
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
