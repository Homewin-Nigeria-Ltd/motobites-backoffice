"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/toast"

import { useReviewSalesExecutive } from "../hooks/use-review-sales-executive"
import type { SalesExecutive } from "../types"
import { canReviewSalesExecutive } from "../utils/map-sales-executive"

export function SalesExecutiveReviewButton({
  application,
}: {
  application: SalesExecutive
}) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const { review, isPending } = useReviewSalesExecutive()

  if (!canReviewSalesExecutive(application.status)) {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  const handleReview = async (status: "approved" | "rejected") => {
    const reviewNotes = notes.trim()

    if (status === "rejected" && !reviewNotes) {
      toast.error("Add a note before rejecting this application.")
      return
    }

    await review({
      id: application.id,
      status,
      ...(reviewNotes ? { review_notes: reviewNotes } : {}),
    })
    setNotes("")
    setOpen(false)
  }

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        Review
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle>Review application</DialogTitle>
          <DialogDescription>
            Approve or reject {application.name}.
          </DialogDescription>
          <Textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Review notes"
            maxLength={2000}
            disabled={isPending}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => void handleReview("rejected")}
            >
              Reject
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={() => void handleReview("approved")}
            >
              Approve
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
