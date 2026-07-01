"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"

import { TicketResolverCombobox } from "@/features/ticket/components/ticket-resolver-combobox"
import { useCreateTicket } from "@/features/ticket/hooks/use-ticket-mutations"
import { useTicketStaffResolvers } from "@/features/ticket/hooks/use-ticket-queries"
import {
  createTicketFormDefaults,
  createTicketSchema,
  ticketTypeOptions,
  type CreateTicketFormValues,
} from "@/features/ticket/schemas/create-ticket.schema"
import type { TicketIssueCategoryOption } from "@/features/ticket/types"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AppLoader } from "@/components/ui/app-loader"

const selectTriggerClassName = "h-11 w-full border-border bg-background"

type CreateTicketDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  issueCategories: TicketIssueCategoryOption[]
}

export function CreateTicketDialog({
  open,
  onOpenChange,
  issueCategories,
}: CreateTicketDialogProps) {
  const { createTicket, isPending } = useCreateTicket()
  const {
    data: staffData,
    isPending: isStaffPending,
    isError: isStaffError,
  } = useTicketStaffResolvers(open)
  const staff = staffData?.items ?? []

  const defaultIssueCategory = issueCategories[0]?.key ?? ""

  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      ...createTicketFormDefaults,
      issueCategory: defaultIssueCategory,
    },
  })

  const resetForm = () => {
    form.reset({
      ...createTicketFormDefaults,
      issueCategory: defaultIssueCategory,
    })
  }

  useEffect(() => {
    if (!open) {
      return
    }

    form.reset({
      ...createTicketFormDefaults,
      issueCategory: defaultIssueCategory,
    })
  }, [open, defaultIssueCategory, form])

  const onSubmit = (values: CreateTicketFormValues) => {
    const resolverId = Number(values.resolverId)

    if (!values.resolverId || Number.isNaN(resolverId)) {
      return
    }

    createTicket({
      type: values.type,
      issueCategory: values.issueCategory,
      description: values.description,
      resolverId,
      orderId: values.orderId?.trim() || undefined,
    }).then((result) => {
      if (!result.success) {
        return
      }

      resetForm()
      onOpenChange(false)
    })
  }

  return (
    <BaseModal
      title="Create Ticket"
      className="max-w-lg"
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          resetForm()
        }
        onOpenChange(next)
      }}
      asForm
      onSubmit={form.handleSubmit(onSubmit)}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating…" : "Create Ticket"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Controller
          name="type"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Ticket Type</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger
                  className={selectTriggerClassName}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select ticket type" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="w-[var(--radix-select-trigger-width)]"
                >
                  {ticketTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="issueCategory"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Issue Category</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending || issueCategories.length === 0}
              >
                <SelectTrigger
                  className={selectTriggerClassName}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select issue category" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="w-[var(--radix-select-trigger-width)]"
                >
                  {issueCategories.map((category) => (
                    <SelectItem key={category.key} value={category.key}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Description</FieldLabel>
              <Textarea {...field} rows={4} />
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="resolverId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Resolver</FieldLabel>
              {isStaffPending ? (
                <AppLoader className="py-4" spinnerClassName="size-5" />
              ) : isStaffError ? (
                <p className="text-sm text-destructive">
                  Failed to load staff list.
                </p>
              ) : staff.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No staff members available.
                </p>
              ) : (
                <TicketResolverCombobox
                  id="create-ticket-resolver"
                  staff={staff}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                  allowClear={false}
                />
              )}
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="orderId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Order ID (optional)</FieldLabel>
              <Input {...field} disabled={isPending} />
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />
      </div>
    </BaseModal>
  )
}
