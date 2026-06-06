"use client"

import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Button } from "@/components/ui/button"

export type BaseAlertDialogProps = {
  title: string
  children: React.ReactNode
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  cancelLabel?: string
  confirmLabel?: string
  pendingLabel?: string
  confirmVariant?: React.ComponentProps<typeof Button>["variant"]
  isPending?: boolean
  onConfirm?: () => void
  headerIcon?: React.ReactNode
  className?: string
}

export function BaseAlertDialog({
  title,
  children,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  pendingLabel = "Please wait...",
  confirmVariant = "default",
  isPending = false,
  onConfirm,
  headerIcon,
  className,
}: BaseAlertDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          {headerIcon ? (
            <AlertDialogMedia>{headerIcon}</AlertDialogMedia>
          ) : null}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>{children}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant={confirmVariant}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? pendingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
