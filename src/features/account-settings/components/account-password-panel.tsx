"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { useUpdateAccountPassword } from "../hooks/use-update-account-password"
import {
  accountPasswordDefaults,
  accountPasswordSchema,
  type AccountPasswordFormValues,
} from "../schemas/account-password.schema"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type PasswordFieldProps = {
  id: string
  label: string
  placeholder: string
  autoComplete: string
  disabled?: boolean
  value: string
  onChange: (value: string) => void
  invalid?: boolean
  error?: { message?: string }
}

function PasswordField({
  id,
  label,
  placeholder,
  autoComplete,
  disabled = false,
  value,
  onChange,
  invalid = false,
  error,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative w-full">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={invalid}
          icon={{ name: "lock", position: "left" }}
          className="h-11 pr-10"
          autoComplete={autoComplete}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          disabled={disabled}
          className={cn(
            "absolute top-1/2 right-3 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors",
            "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <Icons.eyeOff size={18} aria-hidden />
          ) : (
            <Icons.eye size={18} aria-hidden />
          )}
        </button>
      </div>
      {invalid && error ? <FieldError errors={[error]} /> : null}
    </Field>
  )
}

export function AccountPasswordPanel() {
  const { updatePassword, isPending } = useUpdateAccountPassword()

  const form = useForm<AccountPasswordFormValues>({
    resolver: zodResolver(accountPasswordSchema),
    defaultValues: accountPasswordDefaults,
  })

  async function onSubmit(values: AccountPasswordFormValues) {
    try {
      await updatePassword(values)
      form.reset()
    } catch {
      // Errors are handled in the mutation hook.
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Update Password</h3>
      </div>

      <Card className="rounded-xl py-0">
        <form id="account-password-form" onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="border-b border-border px-6 py-5">
            <CardTitle className="text-primary">Update Password</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your current password to make update
            </p>
          </CardHeader>

          <CardContent className="px-6 py-6">
            <FieldGroup className="gap-5">
              <Controller
                name="current_password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <PasswordField
                    id="current-password"
                    label="Current Password"
                    placeholder="Enter Password"
                    autoComplete="current-password"
                    disabled={isPending}
                    value={field.value}
                    onChange={field.onChange}
                    invalid={fieldState.invalid}
                    error={fieldState.error}
                  />
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <PasswordField
                    id="new-password"
                    label="New Password"
                    placeholder="Enter New Password"
                    autoComplete="new-password"
                    disabled={isPending}
                    value={field.value}
                    onChange={field.onChange}
                    invalid={fieldState.invalid}
                    error={fieldState.error}
                  />
                )}
              />

              <Controller
                name="password_confirmation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <PasswordField
                    id="confirm-password"
                    label="Confirm Password"
                    placeholder="Enter New Password"
                    autoComplete="new-password"
                    disabled={isPending}
                    value={field.value}
                    onChange={field.onChange}
                    invalid={fieldState.invalid}
                    error={fieldState.error}
                  />
                )}
              />
            </FieldGroup>
          </CardContent>

          <CardFooter className="justify-end border-t border-border px-6 py-4">
            <Button
              type="submit"
              form="account-password-form"
              className="h-10 px-5"
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
