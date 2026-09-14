import { redirect } from "next/navigation"

type DeliveryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function DeliveryPage({ searchParams }: DeliveryPageProps) {
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
  redirect(queryString ? `/delivery/all?${queryString}` : "/delivery/all")
}
