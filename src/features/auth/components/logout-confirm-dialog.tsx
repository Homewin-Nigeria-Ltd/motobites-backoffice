"use client"

import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { useLogout } from "@/features/auth/hooks/use-logout"

type LogoutConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutConfirmDialog({
  open,
  onOpenChange,
}: LogoutConfirmDialogProps) {
  const { logout, isPending } = useLogout()

  return (
    <BaseAlertDialog
      title="Confirm Log Out"
      open={open}
      onOpenChange={onOpenChange}
      confirmLabel="Log out"
      pendingLabel="Logging out..."
      cancelLabel="Cancel"
      isPending={isPending}
      onConfirm={() => logout()}
      className="sm:max-w-md"
    >
      <p className="text-center text-sm leading-relaxed text-muted-foreground sm:text-left">
        Are you sure you want to log out of your account? Logging out will
        terminate your current session and require you to sign in again to
        access your account. Please confirm your decision to proceed with
        logging out.
      </p>
    </BaseAlertDialog>
  )
}
