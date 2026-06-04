"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Icon, Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

const quickLinks = [
  { label: "Overview", href: "/dashboard", icon: "dashboard" as const },
  { label: "Menu Management", href: "/menu", icon: "book" as const },
  {
    label: "Kitchen Workflow",
    href: "/kitchen",
    icon: "kitchen" as const,
  },
  { label: "Staff Management", href: "/staff", icon: "group" as const },
]

type ErrorViewProps = {
  variant?: "fullscreen" | "embedded"
  onRetry?: () => void
  error?: Error & { digest?: string }
}

export function ErrorView({
  variant = "fullscreen",
  onRetry,
  error,
}: ErrorViewProps) {
  const router = useRouter()
  const showDigest =
    process.env.NODE_ENV === "development" && error?.digest != null

  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-center bg-muted px-4 py-12",
        variant === "fullscreen" && "min-h-[calc(100vh-1px)]",
        variant === "embedded" && "min-h-0"
      )}
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-8 text-center md:p-10">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <Icons.alert size={32} className="text-destructive" />
        </div>

        <p className="font-ui text-7xl font-bold tracking-tight text-destructive md:text-8xl">
          Error
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
          An unexpected error occurred. You can try again or return to the
          dashboard.
        </p>
        {showDigest ? (
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            {error.digest}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {onRetry ? (
            <Button type="button" onClick={onRetry}>
              Try again
            </Button>
          ) : null}
          <Button asChild variant={onRetry ? "outline" : "default"}>
            <Link href="/dashboard" className="inline-flex items-center gap-1.5">
              <Icons.dashboard size={16} />
              Back to dashboard
            </Link>
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Go back
          </Button>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Quick links
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Icon name={link.icon} size={16} className="text-primary" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
