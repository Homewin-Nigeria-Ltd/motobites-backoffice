"use client"

import { useMemo } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { getUserInitials } from "@/utils/get-initials"

type OfflineOrderStaffFieldProps = {
  takenById: string
  takenByName: string
  currentUserId?: number
  currentUserName?: string
  onAssign: (staffId: string, staffName: string) => void
}

export function OfflineOrderStaffField({
  takenById,
  takenByName,
  currentUserId,
}: OfflineOrderStaffFieldProps) {
  const displayName = useMemo(() => {
    if (!takenByName) {
      return "Unassigned"
    }

    if (currentUserId && takenById === String(currentUserId)) {
      return `${takenByName} (You)`
    }

    return takenByName
  }, [currentUserId, takenById, takenByName])

  return (
    <Card className="gap-0 px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={undefined} alt={displayName} />
            <AvatarFallback>{getUserInitials(displayName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{displayName}</p>
          </div>
        </div>

        {/* Reassign temporarily disabled
        <Button
          type="button"
          variant="link"
          className="h-auto shrink-0 p-0 text-primary"
          onClick={() => {
            setDraftStaffId(takenById)
            setOpen(true)
          }}
        >
          Reassign
        </Button>
        */}
      </div>
    </Card>
  )
}
