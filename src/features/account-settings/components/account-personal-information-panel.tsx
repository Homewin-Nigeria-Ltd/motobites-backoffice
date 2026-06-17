"use client"

import { useMemo, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { useUpdateAccountPersonalInfo } from "../hooks/use-update-account-personal-info"
import {
  accountPersonalInfoSchema,
  getAccountPersonalInfoDefaults,
  type AccountPersonalInfoFormValues,
} from "../schemas/account-personal-info.schema"
import type { AccountUser } from "../types"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getUserInitials } from "@/utils/get-initials"

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  }
}

function formatRole(role: string) {
  return role
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}

const languageLabels: Record<string, string> = {
  "en-US": "English (US)",
}

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result

      if (typeof result !== "string") {
        reject(new Error("Could not read profile photo"))
        return
      }

      const base64 = result.includes(",") ? result.split(",")[1] : result
      resolve(base64)
    }

    reader.onerror = () => reject(new Error("Could not read profile photo"))
    reader.readAsDataURL(file)
  })
}

type AccountPersonalInformationPanelProps = {
  user: AccountUser
  onUpdated?: () => void
}

export function AccountPersonalInformationPanel({
  user,
  onUpdated,
}: AccountPersonalInformationPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { firstName: initialFirstName, lastName: initialLastName } = useMemo(
    () => splitName(user.name),
    [user.name]
  )
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const { updatePersonalInfo, isPending } = useUpdateAccountPersonalInfo()

  const form = useForm<AccountPersonalInfoFormValues>({
    resolver: zodResolver(accountPersonalInfoSchema),
    defaultValues: getAccountPersonalInfoDefaults(
      initialFirstName,
      initialLastName
    ),
  })

  const initials = getUserInitials(user.name)
  const languageLabel = languageLabels["en-US"]

  async function onSubmit(values: AccountPersonalInfoFormValues) {
    try {
      await updatePersonalInfo(values)
      onUpdated?.()
    } catch {
      // Errors are handled in the mutation hook.
    }
  }

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const base64 = await readFileAsBase64(file)
      form.setValue("profile_photo", base64, { shouldDirty: true })
      setPhotoPreview(URL.createObjectURL(file))
    } catch {
      form.setError("profile_photo", {
        message: "Could not upload profile photo",
      })
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12">
      <div className="space-y-8">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Profile photo</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              This image will be displayed on your profile
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            icon={{ name: "camera", position: "left" }}
            className="h-10 border-primary text-primary hover:bg-secondary"
            disabled={isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            Change Photo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Personal Information
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your personal details here.
            </p>
          </div>
          <Button
            type="submit"
            form="account-personal-info-form"
            className="h-10 px-5"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <form
        id="account-personal-info-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex justify-center lg:justify-start">
          <div className="relative">
            <Avatar className="size-28">
              <AvatarImage
                src={photoPreview ?? user.profile_photo_url ?? undefined}
                alt={user.name}
              />
              <AvatarFallback className="bg-secondary text-3xl font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute right-1 bottom-1 flex size-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground">
              <Icons.check size={14} />
            </span>
          </div>
        </div>

        <FieldGroup className="gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="first_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="account-first-name">First name</FieldLabel>
                  <Input
                    {...field}
                    id="account-first-name"
                    aria-invalid={fieldState.invalid}
                    className="h-11"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="last_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="account-last-name">Last name</FieldLabel>
                  <Input
                    {...field}
                    id="account-last-name"
                    aria-invalid={fieldState.invalid}
                    className="h-11"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-email">Email address</Label>
            <Input
              id="account-email"
              type="email"
              value={user.email}
              readOnly
              className="h-11 bg-muted"
            />
          </div>

          <Controller
            name="language"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="account-language">Language</FieldLabel>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full justify-between px-3 font-normal"
                  disabled={isPending}
                  onClick={() => field.onChange("en-US")}
                >
                  <span>{languageLabel}</span>
                  <Icons.chevronRight
                    size={18}
                    className="text-muted-foreground"
                  />
                </Button>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="space-y-2">
            <Label htmlFor="account-role">Role</Label>
            <Input
              id="account-role"
              value={formatRole(user.role)}
              readOnly
              className="h-11 bg-muted"
            />
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}
