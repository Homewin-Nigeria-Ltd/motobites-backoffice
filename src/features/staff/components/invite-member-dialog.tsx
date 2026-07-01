"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { RoleCombobox } from "@/features/staff/components/role-combobox"
import { BranchCombobox } from "@/features/restaurant/components/branch-combobox"
import { useInviteStaff } from "@/features/staff/hooks/use-staff-mutations"
import {
  staffMemberFormDefaults,
  staffMemberFormSchema,
  type StaffMemberFormValues,
} from "@/features/staff/schemas/staff-member-form.schema"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"

type InviteMemberDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteMemberDialog({
  open,
  onOpenChange,
}: InviteMemberDialogProps) {
  const { inviteStaff, isPending } = useInviteStaff()

  const form = useForm<StaffMemberFormValues>({
    resolver: zodResolver(staffMemberFormSchema),
    defaultValues: staffMemberFormDefaults,
  })

  const onSubmit = async (values: StaffMemberFormValues) => {
    const result = await inviteStaff({
      name: values.name,
      email: values.email,
      staff_role: values.role,
      fulfillment_branch_id: values.branchId,
    })

    if (result.success) {
      form.reset()
      onOpenChange(false)
    }
  }

  return (
    <BaseModal
      title="Invite Team Member"
      className="max-w-150"
      headerClassName="md:px-10"
      bodyClassName="md:px-10"
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          form.reset()
        }
        onOpenChange(next)
      }}
      headerIcon={<Icons.account size={28} className="text-primary" />}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        id="invite-member-form"
      >
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="invite-full-name">Full Name</FieldLabel>
              <Input
                {...field}
                id="invite-full-name"
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
              <FieldLabel htmlFor="invite-email">Email Address</FieldLabel>
              <Input
                {...field}
                id="invite-email"
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
              <FieldLabel htmlFor="invite-role">Choose Role</FieldLabel>
              <RoleCombobox
                id="invite-role"
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
              <FieldLabel htmlFor="invite-branch">Branch</FieldLabel>
              <BranchCombobox
                id="invite-branch"
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
          disabled={isPending}
        >
          {isPending ? "Sending..." : "Invite Member"}
        </Button>
      </form>
    </BaseModal>
  )
}
