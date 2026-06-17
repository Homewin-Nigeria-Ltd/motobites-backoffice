import { Suspense } from "react"

import { EditRoleSection } from "@/features/role-permissions"

type PageProps = {
  params: Promise<{ roleId: string }>
}

export default async function EditRolePage({ params }: PageProps) {
  const { roleId } = await params

  return (
    <Suspense fallback={null}>
      <EditRoleSection roleId={decodeURIComponent(roleId)} />
    </Suspense>
  )
}
