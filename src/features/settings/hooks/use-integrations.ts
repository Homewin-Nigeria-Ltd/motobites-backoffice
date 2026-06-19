"use client"

import { useQueries, useQuery } from "@tanstack/react-query"

import { settingsQueries } from "../api/queries"
import type { ApiIntegration, IntegrationCategory } from "../integration.types"

export function useIntegrations(category: IntegrationCategory) {
  return useQuery(settingsQueries.integrations(category))
}

export function usePaymentIntegrations() {
  return useIntegrations("payment")
}

export function useMapIntegrations() {
  return useIntegrations("map")
}

export function useRecoveryIntegrations() {
  return useIntegrations("recovery")
}

export function useIntegrationProvider(provider: string) {
  return useQuery({
    ...settingsQueries.integrationProvider(provider),
    enabled: Boolean(provider),
  })
}

function findIntegration(
  integrationId: string,
  paymentData?: ApiIntegration[],
  mapData?: ApiIntegration[],
  recoveryData?: ApiIntegration[]
) {
  const categories: IntegrationCategory[] = ["payment", "map", "recovery"]
  const lists = [paymentData, mapData, recoveryData]

  for (let index = 0; index < lists.length; index += 1) {
    const integration = lists[index]?.find(
      (item) => item.provider === integrationId
    )

    if (integration) {
      return {
        integration,
        category: categories[index],
      }
    }
  }

  return {
    integration: undefined,
    category: undefined,
  }
}

export function useIntegrationDetail(integrationId: string) {
  const categories: IntegrationCategory[] = ["payment", "map", "recovery"]
  const [payment, map, recovery] = useQueries({
    queries: categories.map((category) => settingsQueries.integrations(category)),
  })

  const { integration, category } = findIntegration(
    integrationId,
    payment.data,
    map.data,
    recovery.data
  )

  const isPending = payment.isPending || map.isPending || recovery.isPending
  const isError = payment.isError && map.isError && recovery.isError

  return {
    integration,
    category,
    isPending,
    isError,
  }
}

export type IntegrationDetailResult = {
  integration?: ApiIntegration
  category?: IntegrationCategory
  isPending: boolean
  isError: boolean
}
