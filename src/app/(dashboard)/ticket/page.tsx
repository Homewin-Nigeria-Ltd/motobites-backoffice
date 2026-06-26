import { redirect } from "next/navigation"

export default function LegacyTicketPage() {
  redirect("/customers/tickets")
}
