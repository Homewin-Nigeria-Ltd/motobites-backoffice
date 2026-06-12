import { Suspense } from "react"

import { CustomerDetailSection } from "@/features/customers"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params

  return (
    <Suspense fallback={null}>
      <CustomerDetailSection customerId={decodeURIComponent(id)} />
    </Suspense>
  )
}
