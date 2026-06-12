import type { CustomerDetail } from "@/features/customers/types"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

const detailGrid =
  "grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
const detailField = "min-w-0 space-y-2"
const detailLabel = "text-sm text-muted-foreground"
const detailValue =
  "max-w-full text-xs font-medium break-words text-foreground"

type CustomerPersonalInfoProps = {
  customer: CustomerDetail
}

function DetailField({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={detailField}>
      <p className={detailLabel}>{label}</p>
      <p className={cn(detailValue, className)}>{value}</p>
    </div>
  )
}

export function CustomerPersonalInfo({ customer }: CustomerPersonalInfoProps) {
  return (
    <div className="flex flex-col items-start gap-8 py-2 md:gap-10 md:py-4">
      <div className="relative self-start">
        <Avatar className="size-28 border-4 border-background shadow-sm">
          <AvatarImage src={customer.avatar ?? undefined} alt={customer.name} />
          <AvatarFallback className="bg-primary/15 text-3xl font-semibold text-primary">
            {customer.initials}
          </AvatarFallback>
        </Avatar>
        <span className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <Icons.check size={14} />
        </span>
      </div>

      <div className={cn(detailGrid, "w-full")}>
        <DetailField label="First name" value={customer.firstName} />
        <DetailField label="Last name" value={customer.lastName} />
        <div className="min-w-0 sm:col-span-2">
          <DetailField
            label="Email"
            value={customer.email}
            className="break-all"
          />
        </div>
        <DetailField label="Phone Number" value={customer.phone} />
        <div className="min-w-0 sm:col-span-2 xl:col-span-3">
          <DetailField
            label="Home Address"
            value={customer.homeAddress}
            className="whitespace-pre-line"
          />
        </div>
      </div>
    </div>
  )
}
