"use client"

import { useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { ASSETS } from "@/constants/assets"
import { cn } from "@/lib/utils"
import { useLogin } from "../hooks/use-login"
import { loginSchema, type LoginInput } from "../schemas/login.schema"

export function LoginForm() {
  const { login, isPending } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: LoginInput) {
    login(data)
  }

  return (
    <Card className="w-full max-w-lg gap-6 px-2 py-2 shadow-soft sm:px-4 sm:py-4">
      <CardHeader className="items-center gap-3 px-4 text-center sm:px-6">
        <Image
          src={ASSETS.brand.logo}
          alt="Motobites Admin"
          width={191}
          height={32}
          priority
          className="h-8 w-auto max-w-full"
        />
        <CardDescription className="text-base">
          Sign in to your admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-5">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="login-email"
                    className="text-base font-medium"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="login-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Email"
                    autoComplete="email"
                    className="h-12 rounded-md px-4 text-base md:text-base"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="login-password"
                    className="text-base font-medium"
                  >
                    Password
                  </FieldLabel>
                  <div className="relative w-full">
                    <Input
                      {...field}
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="h-12 rounded-md px-4 pr-12 text-base md:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      className={cn(
                        "absolute top-1/2 right-3 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors",
                        "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      )}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <Icons.eyeOff size={20} aria-hidden />
                      ) : (
                        <Icons.eye size={20} aria-hidden />
                      )}
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="px-4 pb-6 sm:px-6">
        <Button
          type="submit"
          form="login-form"
          size="lg"
          className="h-12 w-full text-base font-semibold"
          disabled={isPending}
        >
          {isPending ? "Signing in…" : "Sign in"}
        </Button>
      </CardFooter>
    </Card>
  )
}
