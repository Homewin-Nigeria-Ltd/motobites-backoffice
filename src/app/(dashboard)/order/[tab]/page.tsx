import { notFound } from "next/navigation"

import { OrderManagementSection } from "@/features/order"
import { isOrderTab } from "@/features/order/types"

type PageProps = {
  params: Promise<{ tab: string }>
}

export default async function OrderTabPage({ params }: PageProps) {
  const { tab } = await params

  if (!isOrderTab(tab)) {
    notFound()
  }

  return <OrderManagementSection tab={tab} />
}
