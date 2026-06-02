"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

function Field({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function FieldGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" className={className} {...props} />
}

function FieldError({
  className,
  errors,
  children,
}: {
  className?: string
  errors?: Array<{ message?: string } | undefined>
  children?: React.ReactNode
}) {
  const message =
    children ??
    errors
      ?.map((error) => error?.message)
      .find((value) => Boolean(value))

  if (!message) return null

  return (
    <p
      data-slot="field-error"
      role="alert"
      className={cn("text-sm text-destructive", className)}
    >
      {message}
    </p>
  )
}

export { Field, FieldGroup, FieldLabel, FieldError }
