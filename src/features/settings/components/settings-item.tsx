"use client"

import Link from "next/link"

import type { SettingsItem } from "@/features/settings/types"
import { Icons, type IconName } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

function SettingsIcon({
  icon,
  variant = "default",
}: {
  icon: IconName
  variant?: "default" | "danger"
}) {
  const IconComponent = Icons[icon]

  return (
    <div
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-full",
        variant === "danger" ? "bg-destructive/10" : "bg-secondary"
      )}
    >
      <IconComponent
        size={22}
        className={variant === "danger" ? "text-destructive" : "text-primary"}
      />
    </div>
  )
}

const itemClassName =
  "flex w-full min-w-0 items-start justify-between gap-4 rounded-2xl py-1 text-left"

export function SettingsLinkItem({ item }: { item: SettingsItem }) {
  return (
    <Link href={item.href} className={itemClassName}>
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <SettingsIcon icon={item.icon} variant={item.iconVariant} />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-base font-semibold text-foreground">{item.title}</p>
          <p className="wrap-break-word text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </div>
      </div>
      <Icons.chevronRight
        size={20}
        className="mt-1 shrink-0 text-primary"
        aria-hidden
      />
    </Link>
  )
}

type SettingsActionItemProps = {
  title: string
  description: string
  icon: IconName
  iconVariant?: "default" | "danger"
  onClick: () => void
}

export function SettingsActionItem({
  title,
  description,
  icon,
  iconVariant = "default",
  onClick,
}: SettingsActionItemProps) {
  return (
    <button type="button" onClick={onClick} className={itemClassName}>
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <SettingsIcon icon={icon} variant={iconVariant} />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-base font-semibold text-foreground">{title}</p>
          <p className="wrap-break-word text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <Icons.chevronRight
        size={20}
        className="mt-1 shrink-0 text-primary"
        aria-hidden
      />
    </button>
  )
}
