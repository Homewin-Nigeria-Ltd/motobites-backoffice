import type { PermissionsGrantStatus } from "../types"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

const badgeStyles: Record<
  PermissionsGrantStatus,
  { badge: string; icon: string }
> = {
  all: {
    badge: "bg-emerald-50 text-emerald-700",
    icon: "text-emerald-600",
  },
  few: {
    badge: "bg-sky-50 text-sky-700",
    icon: "text-sky-600",
  },
}

type RolePermissionBadgeProps = {
  label: string
  status: PermissionsGrantStatus
  className?: string
}

export function RolePermissionBadge({
  label,
  status,
  className,
}: RolePermissionBadgeProps) {
  const styles = badgeStyles[status]

  return (
    <Badge
      className={cn(
        "h-auto w-fit max-w-full shrink items-start gap-1 overflow-visible rounded-md px-2 py-1 text-[10px] font-semibold leading-tight whitespace-normal",
        styles.badge,
        className
      )}
    >
      <Icons.lock size={12} className={cn("mt-0.5 shrink-0", styles.icon)} />
      <span className="min-w-0 break-words">{label}</span>
    </Badge>
  )
}
