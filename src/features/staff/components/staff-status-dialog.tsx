"use client"

import { useState } from "react"

import { useUpdateStaffStatus } from "@/features/staff/hooks/use-staff-mutations"
import type { StaffAccountStatus, StaffMember } from "@/features/staff/types"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Icons } from "@/components/ui/icons"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const STATUS_OPTIONS: { value: StaffAccountStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
]

type StaffStatusDialogProps = {
  member: StaffMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function StaffStatusForm({
  member,
  onDone,
}: {
  member: StaffMember
  onDone: () => void
}) {
  const { updateStatus, isPending, pendingMemberId } = useUpdateStaffStatus()
  const [status, setStatus] = useState<StaffAccountStatus>(member.accountStatus)

  const isSaving = isPending && pendingMemberId === member.id

  const handleSubmit = async () => {
    const result = await updateStatus({ id: member.id, status })
    if (result.success) {
      onDone()
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Update the account status for{" "}
        <span className="font-medium text-foreground">{member.name}</span>.
      </p>

      <Field>
        <FieldLabel htmlFor="staff-status">Status</FieldLabel>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as StaffAccountStatus)}
        >
          <SelectTrigger
            id="staff-status"
            className="h-11 w-full border-border bg-background"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            className="w-[var(--radix-select-trigger-width)]"
          >
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Button
        type="button"
        size="lg"
        className="h-11 w-full"
        disabled={isSaving}
        onClick={() => void handleSubmit()}
      >
        {isSaving ? "Updating..." : "Update status"}
      </Button>
    </div>
  )
}

export function StaffStatusDialog({
  member,
  open,
  onOpenChange,
}: StaffStatusDialogProps) {
  return (
    <BaseModal
      title="Update Status"
      className="max-w-md"
      open={open}
      onOpenChange={onOpenChange}
      headerIcon={<Icons.userCog size={28} className="text-primary" />}
    >
      {member ? (
        <StaffStatusForm
          key={member.id}
          member={member}
          onDone={() => onOpenChange(false)}
        />
      ) : null}
    </BaseModal>
  )
}
