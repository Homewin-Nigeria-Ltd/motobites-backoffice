"use client"

import { useState } from "react"

import { EditMemberDialog } from "@/features/staff/components/edit-member-dialog"
import {
  useRemoveStaff,
  useToggleStaffFavorite,
} from "@/features/staff/hooks/use-staff-mutations"
import type { StaffMember } from "@/features/staff/types"
import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { Button } from "@/components/ui/button"

type StaffRowActionsProps = {
  member: StaffMember
}

export function StaffRowActions({ member }: StaffRowActionsProps) {
  const { removeStaff, isPending, pendingMemberId } = useRemoveStaff()
  const {
    toggleFavorite,
    isPending: isFavoritePending,
    pendingMemberId: favoritePendingMemberId,
  } = useToggleStaffFavorite()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const isDeleting = isPending && pendingMemberId === member.id
  const isTogglingFavorite =
    isFavoritePending && favoritePendingMemberId === member.id

  return (
    <>
      <div className="flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          aria-label={`Edit ${member.name}`}
          icon={{ name: "edit", position: "left" }}
          onClick={() => setEditOpen(true)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          aria-label={`Delete ${member.name}`}
          icon={{ name: "trash", position: "left" }}
          onClick={() => setDeleteOpen(true)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={
            member.isFavorited
              ? "text-primary hover:bg-primary/10 hover:text-primary"
              : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
          }
          aria-label={
            member.isFavorited
              ? `Remove ${member.name} from favorites`
              : `Add ${member.name} to favorites`
          }
          aria-pressed={member.isFavorited}
          disabled={isTogglingFavorite}
          icon={{
            name: "heart",
            position: "left",
            className: member.isFavorited ? "fill-current" : undefined,
          }}
          onClick={() => {
            void toggleFavorite(member.id)
          }}
        />
      </div>

      <EditMemberDialog
        member={member}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <BaseAlertDialog
        title="Remove team member?"
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        confirmLabel="Remove"
        pendingLabel="Removing..."
        confirmVariant="destructive"
        isPending={isDeleting}
        onConfirm={() => {
          void removeStaff(member.id).then((result) => {
            if (result.success) {
              setDeleteOpen(false)
            }
          })
        }}
      >
        This will remove &quot;{member.name}&quot; from your team. This action
        cannot be undone.
      </BaseAlertDialog>
    </>
  )
}
