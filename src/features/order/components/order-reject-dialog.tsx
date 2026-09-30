"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { useRejectOrder } from "@/features/order/hooks/use-order-mutations"
import {
  rejectOrderSchema,
  type RejectOrderFormValues,
} from "@/features/order/schemas/reject-order.schema"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

type OrderRejectDialogProps = {
  orderId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onRejected?: () => void
}

export function OrderRejectDialog({
  orderId,
  open,
  onOpenChange,
  onRejected,
}: OrderRejectDialogProps) {
  const { rejectOrderAsync, isPending } = useRejectOrder()
  const form = useForm<RejectOrderFormValues>({
    resolver: zodResolver(rejectOrderSchema),
    defaultValues: {
      reason: "",
    },
  })

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset({ reason: "" })
    }
    onOpenChange(nextOpen)
  }

  async function handleReject(values: RejectOrderFormValues) {
    await rejectOrderAsync({
      orderId,
      reason: values.reason.trim(),
    })
    handleOpenChange(false)
    onRejected?.()
  }

  return (
    <BaseModal
      title="Decline Order"
      open={open}
      onOpenChange={handleOpenChange}
      asForm
      onSubmit={form.handleSubmit(handleReject)}
      className="max-w-lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" variant="destructive" disabled={isPending}>
            {isPending ? "Declining..." : "Decline order"}
          </Button>
        </div>
      }
    >
      <Controller
        name="reason"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="order-reject-reason">Reason</FieldLabel>
            <Textarea
              {...field}
              id="order-reject-reason"
              rows={4}
              placeholder="Selected items are unavailable."
              aria-invalid={fieldState.invalid}
              disabled={isPending}
            />
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        )}
      />
    </BaseModal>
  )
}
