import { redirect } from "next/navigation"

export default function LegacyAdminCustomerTicketsListPage() {
  redirect("/customers/tickets/list")
}
