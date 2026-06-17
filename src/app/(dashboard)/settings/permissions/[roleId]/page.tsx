import { Suspense } from "react"

import { RoleDetailSection } from "@/features/role-permissions"

type PageProps = {
  params: Promise<{ roleId: string }>
}

export default async function RoleDetailPage({ params }: PageProps) {
  const { roleId } = await params

  return (
    <Suspense fallback={null}>
      <RoleDetailSection roleId={decodeURIComponent(roleId)} />
    </Suspense>
  )
}
