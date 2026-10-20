import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function ReferralFundedBadge({ funded }: { funded: boolean }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "h-auto rounded-full border-0 px-2.5 py-1 text-xs font-medium",
        funded
          ? "bg-emerald-500/10 text-emerald-700"
          : "bg-muted text-muted-foreground"
      )}
    >
      {funded ? "Funded" : "Unfunded"}
    </Badge>
  )
}
