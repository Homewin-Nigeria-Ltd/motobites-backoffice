"use client"

import { useState } from "react"

import { DeliveryHubLayoutClient } from "@/features/delivery-management/components/delivery-hub-layout-client"
import { RidersSection } from "@/features/riders"

export function RidersPageClient() {
  const [search, setSearch] = useState("")

  return (
    <DeliveryHubLayoutClient
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search riders"
    >
      <RidersSection search={search} onSearchChange={setSearch} />
    </DeliveryHubLayoutClient>
  )
}
