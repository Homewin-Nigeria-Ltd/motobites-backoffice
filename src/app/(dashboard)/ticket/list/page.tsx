import { redirect } from "next/navigation"

export default function LegacyTicketListPage() {
  redirect("/customers/tickets/list")
}
