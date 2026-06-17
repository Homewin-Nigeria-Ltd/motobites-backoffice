import { notFound } from "next/navigation"

import { isDeliveryTab } from "@/features/delivery-management/types"
import { DeliveryStatusSectionClient } from "../delivery-status-section-client"

type PageProps = {
  params: Promise<{ tab: string }>
}

export default async function DeliveryStatusTabPage({ params }: PageProps) {
  const { tab } = await params

  if (!isDeliveryTab(tab)) {
    notFound()
  }

  return <DeliveryStatusSectionClient tab={tab} />
}
