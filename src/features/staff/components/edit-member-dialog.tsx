"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { RoleCombobox } from "@/features/staff/components/role-combobox"
import { BranchCombobox } from "@/features/restaurant/components/branch-combobox"
import { useUpdateStaff } from "@/features/staff/hooks/use-staff-mutations"
import {
  staffMemberFormDefaults,
  staffMemberFormSchema,
  type StaffMemberFormValues,
} from "@/features/staff/schemas/staff-member-form.schema"
import type { StaffMember } from "@/features/staff/types"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"

type EditMemberDialogProps = {
  member: StaffMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditMemberDialog({
  member,
  open,
  onOpenChange,
}: EditMemberDialogProps) {
  const { updateStaff, isPending, pendingMemberId } = useUpdateStaff()

  const form = useForm<StaffMemberFormValues>({
    resolver: zodResolver(staffMemberFormSchema),
    defaultValues: staffMemberFormDefaults,
  })

  useEffect(() => {
    if (!member || !open) {
      return
    }

    form.reset({
      name: member.name,
      email: member.email,
      role: member.staffRole,
      branchId: member.branchId,
    })
  }, [member, open, form])

  const onSubmit = async (values: StaffMemberFormValues) => {
    if (!member) {
      return
    }

    const result = await updateStaff({
      id: member.id,
      name: values.name,
      email: values.email,
      staff_role: values.role,
      fulfillment_branch_id: values.branchId,
    })

    if (result.success) {
      onOpenChange(false)
    }
  }

  const isSaving = isPending && pendingMemberId === member?.id

  return (
    <BaseModal
      title="Edit Team Member"
      className="max-w-150"
      headerClassName="md:px-10"
      bodyClassName="md:px-10"
      open={open}
      onOpenChange={onOpenChange}
      headerIcon={<Icons.edit size={28} className="text-primary" />}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        id="edit-member-form"
      >
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="edit-full-name">Full Name</FieldLabel>
              <Input
                {...field}
                id="edit-full-name"
                placeholder="Enter Full Name"
                aria-invalid={fieldState.invalid}
                icon={{ name: "account", position: "left" }}
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="edit-email">Email Address</FieldLabel>
              <Input
                {...field}
                id="edit-email"
                type="email"
                placeholder="Enter Email Address"
                aria-invalid={fieldState.invalid}
                icon={{ name: "mail", position: "left" }}
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="edit-role">Choose Role</FieldLabel>
              <RoleCombobox
                id="edit-role"
                value={field.value}
                onChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="branchId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="edit-branch">Branch</FieldLabel>
              <BranchCombobox
                id="edit-branch"
                value={field.value}
                onChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="mt-2 h-11 w-full"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </BaseModal>
  )
}
