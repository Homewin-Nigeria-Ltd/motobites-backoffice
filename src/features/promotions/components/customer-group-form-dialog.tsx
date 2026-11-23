"use client"

import { useState, type FormEvent } from "react"

import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EligibleCustomersCombobox } from "@/features/promotions/components/eligible-customers-combobox"
import {
  useCreateCustomerGroup,
  useUpdateCustomerGroup,
} from "@/features/promotions/hooks/use-promotion-mutations"
import { useCustomerGroup } from "@/features/promotions/hooks/use-promotion-queries"
import type { CustomerGroup, CustomerGroupMember } from "@/features/promotions/types"

type CustomerGroupFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  group?: CustomerGroup | null
}

type CustomerGroupFormFieldsProps = {
  isEdit: boolean
  groupId?: string
  initialName: string
  initialDescription: string
  initialCustomerIds: string[]
  initialCustomers: CustomerGroupMember[]
  onOpenChange: (open: boolean) => void
}

function CustomerGroupFormFields({
  isEdit,
  groupId,
  initialName,
  initialDescription,
  initialCustomerIds,
  initialCustomers,
  onOpenChange,
}: CustomerGroupFormFieldsProps) {
  const { createCustomerGroup, isPending: isCreating } =
    useCreateCustomerGroup()
  const { updateCustomerGroup, isPending: isUpdating } =
    useUpdateCustomerGroup()
  const isPending = isCreating || isUpdating

  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [customerIds, setCustomerIds] = useState(initialCustomerIds)
  const [nameError, setNameError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) {
      setNameError("Group name is required")
      return
    }

    const payload = {
      name: trimmedName,
      description: description.trim() || undefined,
      customer_ids: customerIds
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id) && id > 0),
    }

    const result =
      isEdit && groupId
        ? await updateCustomerGroup({ groupId, input: payload })
        : await createCustomerGroup(payload)

    if (result.success) {
      onOpenChange(false)
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => void handleSubmit(event)}
    >
      <Field data-invalid={Boolean(nameError)}>
        <FieldLabel htmlFor="customer-group-name">Group name</FieldLabel>
        <Input
          id="customer-group-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            if (nameError) setNameError(null)
          }}
          placeholder="e.g. VIP customers"
          disabled={isPending}
          className="h-11"
        />
        {nameError ? <FieldError>{nameError}</FieldError> : null}
      </Field>

      <Field>
        <FieldLabel htmlFor="customer-group-description">
          Description
        </FieldLabel>
        <Textarea
          id="customer-group-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Optional notes about this group"
          rows={3}
          disabled={isPending}
        />
      </Field>

      <Field>
        <FieldLabel>Customers</FieldLabel>
        <EligibleCustomersCombobox
          value={customerIds}
          onChange={setCustomerIds}
          disabled={isPending}
          initialOptions={initialCustomers}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Select one or more customers for this group.
        </p>
      </Field>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : isEdit
              ? "Save changes"
              : "Create group"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function CustomerGroupFormDialog({
  open,
  onOpenChange,
  group,
}: CustomerGroupFormDialogProps) {
  const isEdit = Boolean(group)
  const groupId = group?.id ?? ""
  const {
    data: groupDetail,
    isPending: isLoadingDetail,
    isError: isDetailError,
    error: detailError,
  } = useCustomerGroup(groupId, open && isEdit)

  const activeGroup = isEdit ? groupDetail : null
  const showEditLoader = open && isEdit && isLoadingDetail && !groupDetail
  const showEditError =
    open && isEdit && isDetailError && !groupDetail
  const showForm =
    open &&
    (!isEdit || Boolean(groupDetail)) &&
    !showEditLoader &&
    !showEditError

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit customer group" : "Create customer group"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this group or assign customers to it."
              : "Create a group that promo codes can target."}
          </DialogDescription>
        </DialogHeader>

        {showEditLoader ? (
          <AppLoader className="min-h-40" />
        ) : showEditError ? (
          <p className="text-sm text-destructive">
            {detailError instanceof Error
              ? detailError.message
              : "Failed to load customer group."}
          </p>
        ) : showForm ? (
          <CustomerGroupFormFields
            key={
              isEdit
                ? `edit-${groupId}-${activeGroup?.customerIds.join("-") ?? ""}`
                : "create"
            }
            isEdit={isEdit}
            groupId={groupId || undefined}
            initialName={activeGroup?.name ?? ""}
            initialDescription={activeGroup?.description ?? ""}
            initialCustomerIds={(activeGroup?.customerIds ?? []).map(String)}
            initialCustomers={activeGroup?.customers ?? []}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
