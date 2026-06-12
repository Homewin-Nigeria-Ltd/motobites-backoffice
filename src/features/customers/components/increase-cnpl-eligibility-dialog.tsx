"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { useIncreaseCnplEligibility } from "@/features/customers/hooks/use-customer-mutations"
import {
  increaseCnplEligibilitySchema,
  type IncreaseCnplEligibilityFormValues,
} from "@/features/customers/schemas/increase-cnpl-eligibility.schema"
import { formatNairaAmount } from "@/features/customers/utils/customer-format"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type IncreaseCnplEligibilityDialogProps = {
  customerId: string
  currentEligibility: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IncreaseCnplEligibilityDialog({
  customerId,
  currentEligibility,
  open,
  onOpenChange,
}: IncreaseCnplEligibilityDialogProps) {
  const { increaseCnplEligibility, isPending } =
    useIncreaseCnplEligibility(customerId)

  const form = useForm<IncreaseCnplEligibilityFormValues>({
    resolver: zodResolver(increaseCnplEligibilitySchema),
    defaultValues: {
      amount: 1000,
    },
  })

  const onSubmit = async (values: IncreaseCnplEligibilityFormValues) => {
    const result = await increaseCnplEligibility({
      id: customerId,
      amount: values.amount,
    })

    if (result.success) {
      form.reset({ amount: 1000 })
      onOpenChange(false)
    }
  }

  return (
    <BaseModal
      title="Increase Eligibility"
      open={open}
      onOpenChange={onOpenChange}
      asForm
      onSubmit={form.handleSubmit(onSubmit)}
      footer={
        <div className="flex w-full justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Increase Limit"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Current eligibility limit:{" "}
          <span className="font-medium text-foreground">
            {formatNairaAmount(currentEligibility)}
          </span>
        </p>

        <Controller
          name="amount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="cnpl-eligibility-amount">
                Increase by
              </FieldLabel>
              <Input
                {...field}
                id="cnpl-eligibility-amount"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                placeholder="1000"
                onChange={(event) => field.onChange(event.target.value)}
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
      </div>
    </BaseModal>
  )
}
