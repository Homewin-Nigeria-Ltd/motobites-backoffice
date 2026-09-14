import { redirect } from "next/navigation"

type OrderPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const params = await searchParams
  const query = new URLSearchParams()

  for (const [key, val] of Object.entries(params)) {
    if (typeof val === "string") {
      query.set(key, val)
    } else if (Array.isArray(val)) {
      val.forEach((v) => query.append(key, v))
    }
  }

  const queryString = query.toString()
  redirect(queryString ? `/order/pending?${queryString}` : "/order/pending")
}
