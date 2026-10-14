import { requireSuperAdmin } from "@/lib/require-permission"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSuperAdmin()

  return children
}
