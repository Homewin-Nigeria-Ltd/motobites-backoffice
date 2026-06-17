import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function getStatusStyles(status: string) {
  const normalized = status.toLowerCase()

  if (normalized === "active") {
    return {
      styles: "bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-600",
    }
  }

  if (normalized === "pending") {
    return {
      styles: "bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    }
  }

  if (normalized === "away") {
    return {
      styles: "bg-[#FFF6E5] text-[#C98A00]",
      dot: "bg-[#F5A623]",
    }
  }

  return {
    styles: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  }
}

function formatStatusLabel(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function RiderStatusBadge({ status }: { status: string }) {
  const { styles, dot } = getStatusStyles(status)

  return (
    <Badge className={cn("h-auto rounded-full border-0 px-3 py-1", styles)}>
      <span className={cn("mr-2 inline-block size-1.5 rounded-full", dot)} />
      {formatStatusLabel(status)}
    </Badge>
  )
}
