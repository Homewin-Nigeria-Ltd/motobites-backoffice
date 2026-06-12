"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import {
  useDeactivateCustomer,
  useDeleteCustomer,
  useSuspendCustomer,
} from "@/features/customers/hooks/use-customer-mutations"
import type { CustomerStatus } from "@/features/customers/types"
import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { Button } from "@/components/ui/button"
import { Icon, type IconName } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

type CustomerAccountManagementProps = {
  customerId: string
  customerName: string
  status: CustomerStatus
}

type ManagementAction = "delete" | "suspend" | "deactivate"
type ConfirmAction = ManagementAction | null

const actionButtons: {
  key: ManagementAction
  label: string
  icon: IconName
  className: string
}[] = [
  {
    key: "suspend",
    label: "Suspend Account",
    icon: "remove",
    className:
      "bg-muted text-foreground hover:bg-muted/80 hover:text-foreground",
  },
  {
    key: "deactivate",
    label: "Deactivate Account",
    icon: "eyeOff",
    className: "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
  },
  {
    key: "delete",
    label: "Delete Account",
    icon: "trash",
    className:
      "bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive",
  },
]

export function CustomerAccountManagement({
  customerId,
  customerName,
  status,
}: CustomerAccountManagementProps) {
  const router = useRouter()
  const { deleteCustomer, isPending: isDeleting } = useDeleteCustomer()
  const { suspendCustomer, isPending: isSuspending } = useSuspendCustomer()
  const {
    deactivateCustomer,
    isPending: isDeactivating,
  } = useDeactivateCustomer()
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)

  const isPending = isDeleting || isSuspending || isDeactivating

  const dialogCopy = {
    delete: {
      title: "Delete customer account?",
      confirmLabel: "Delete Account",
      pendingLabel: "Deleting...",
      confirmVariant: "destructive" as const,
      body: `This will permanently delete "${customerName}". This action cannot be undone.`,
      action: async () => {
        const result = await deleteCustomer(customerId)
        if (result.success) {
          router.push("/customers")
        }
        return result
      },
    },
    suspend: {
      title: "Suspend customer account?",
      confirmLabel: "Suspend Account",
      pendingLabel: "Suspending...",
      confirmVariant: "default" as const,
      body: `This will suspend "${customerName}" from using the platform.`,
      action: () => suspendCustomer(customerId),
    },
    deactivate: {
      title: "Deactivate customer account?",
      confirmLabel: "Deactivate Account",
      pendingLabel: "Deactivating...",
      confirmVariant: "destructive" as const,
      body: `This will deactivate "${customerName}"'s account.`,
      action: () => deactivateCustomer(customerId),
    },
  }

  const activeDialog = confirmAction ? dialogCopy[confirmAction] : null

  return (
    <>
      <div className="flex flex-col items-center gap-4 py-1 md:gap-5 md:py-2">
        {actionButtons.map((button) => {
          const isDisabled =
            (button.key === "suspend" && status === "suspended") ||
            (button.key === "deactivate" && status === "deactivated")

          return (
            <Button
              key={button.key}
              type="button"
              variant="ghost"
              disabled={isDisabled}
              className={cn(
                "h-14 w-full max-w-md justify-between rounded-xl px-5 text-base font-medium md:px-6",
                button.className
              )}
              onClick={() => setConfirmAction(button.key)}
            >
              {button.label}
              <Icon name={button.icon} size={20} />
            </Button>
          )
        })}
      </div>

      {activeDialog ? (
        <BaseAlertDialog
          title={activeDialog.title}
          open={confirmAction !== null}
          onOpenChange={(open) => {
            if (!open) {
              setConfirmAction(null)
            }
          }}
          confirmLabel={activeDialog.confirmLabel}
          pendingLabel={activeDialog.pendingLabel}
          confirmVariant={activeDialog.confirmVariant}
          isPending={isPending}
          onConfirm={() => {
            void activeDialog.action().then((result) => {
              if (result.success) {
                setConfirmAction(null)
              }
            })
          }}
        >
          {activeDialog.body}
        </BaseAlertDialog>
      ) : null}
    </>
  )
}
