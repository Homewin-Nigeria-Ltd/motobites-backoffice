import { Suspense } from "react"

import { OrderManagementLayout } from "@/features/order/sections/order-management-layout"
import { AppLoader } from "@/components/ui/app-loader"

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-0 flex-1 items-center justify-center bg-muted">
          <AppLoader />
        </div>
      }
    >
      <OrderManagementLayout>{children}</OrderManagementLayout>
    </Suspense>
  )
}
