"use client"

import { useState } from "react"

import { OrderAssigneeCombobox } from "@/features/order/components/order-assignee-combobox"
import { useAssignOrderAssignee } from "@/features/order/hooks/use-order-mutations"
import { useOrderAssignees } from "@/features/order/hooks/use-order-queries"
import type { OrderAssigneeType } from "@/features/order/types"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AppLoader } from "@/components/ui/app-loader"
import { Icons } from "@/components/ui/icons"
import { toast } from "@/lib/toast"

const dialogCopy: Record<
  OrderAssigneeType,
  { title: string; label: string; placeholder: string }
> = {
  chef: {
    title: "Assign Chef",
    label: "Choose chef",
    placeholder: "Select chef",
  },
  rider: {
    title: "Assign MotoPilot",
    label: "Choose MotoPilot",
    placeholder: "Select MotoPilot",
  },
  support: {
    title: "Assign Customer Care Representative",
    label: "Choose representative",
    placeholder: "Select representative",
  },
}

type OrderAssigneeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  type: OrderAssigneeType
  currentAssigneeId?: number | null
}

export function OrderAssigneeDialog({
  open,
  onOpenChange,
  orderId,
  type,
  currentAssigneeId,
}: OrderAssigneeDialogProps) {
  const selectionKey = `${type}-${currentAssigneeId ?? "none"}`
  const [selectedId, setSelectedId] = useState("")
  const [selectionSeed, setSelectionSeed] = useState("")

  if (open && selectionKey !== selectionSeed) {
    setSelectionSeed(selectionKey)
    setSelectedId(currentAssigneeId != null ? String(currentAssigneeId) : "")
  }

  const { data: assignees = [], isPending, isError } = useOrderAssignees(type, open)
  const { assignAssignee, isPending: isAssigning } = useAssignOrderAssignee()

  const copy = dialogCopy[type]

  const handleSubmit = () => {
    const userId = Number(selectedId)

    if (!selectedId || Number.isNaN(userId)) {
      toast.error("Please select an assignee")
      return
    }

    assignAssignee(
      { orderId, type, userId },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <BaseModal
      title={copy.title}
      open={open}
      onOpenChange={onOpenChange}
      headerIcon={<Icons.account size={28} className="text-primary" />}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || isError || isAssigning || assignees.length === 0}
          >
            {isAssigning ? "Saving…" : "Save"}
          </Button>
        </div>
      }
    >
      <div className="space-y-2">
        <Label htmlFor={`assignee-${type}`}>{copy.label}</Label>
        {isPending ? (
          <AppLoader className="py-8" spinnerClassName="size-6" />
        ) : isError ? (
          <p className="text-sm text-destructive">
            Failed to load assignees. Please try again.
          </p>
        ) : (
          <OrderAssigneeCombobox
            id={`assignee-${type}`}
            assignees={assignees}
            value={selectedId}
            onChange={setSelectedId}
            placeholder={copy.placeholder}
            disabled={isAssigning}
          />
        )}
      </div>
    </BaseModal>
  )
}
