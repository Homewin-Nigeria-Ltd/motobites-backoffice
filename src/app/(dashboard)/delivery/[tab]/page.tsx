import { notFound } from "next/navigation"

import { isDeliveryTab } from "@/features/delivery-management/types"
import { DeliverySectionClient } from "../delivery-section-client"

type PageProps = {
  params: Promise<{ tab: string }>
}

export default async function DeliveryTabPage({ params }: PageProps) {
  const { tab } = await params

  if (!isDeliveryTab(tab)) {
    notFound()
  }

  return <DeliverySectionClient tab={tab} />
}
