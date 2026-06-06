import { Suspense } from "react"

import { MenuDetailSection } from "@/features/restaurant"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function KitchenDetailPage({ params }: PageProps) {
  const { id } = await params

  return (
    <Suspense fallback={null}>
      <MenuDetailSection kitchenId={decodeURIComponent(id)} />
    </Suspense>
  )
}
