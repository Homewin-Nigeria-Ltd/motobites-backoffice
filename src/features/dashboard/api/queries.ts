import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"

import type {
  DashboardOverviewData,
  DashboardOverviewParams,
  DashboardOverviewResponse,
  OperationalReportsData,
  OperationalReportsResponse,
  BnplAnalyticsData,
  BnplAnalyticsResponse,
  RiderAnalyticsData,
  RiderAnalyticsResponse,
  TotalDeliveriesCardData,
  TotalDeliveriesCardResponse,
} from "../types"
import { dashboardEndpoints } from "./endpoints"
import { dashboardKeys } from "./keys"

async function fetchDashboardOverview(
  params: DashboardOverviewParams
): Promise<DashboardOverviewData> {
  const query: Record<string, string> = { period: params.period }

  if (params.from) {
    query.from = params.from
  }

  if (params.to) {
    query.to = params.to
  }

  if (params.fulfillment_branch_id !== undefined && params.fulfillment_branch_id !== null) {
    query.fulfillment_branch_id = String(params.fulfillment_branch_id)
  }

  const response = await api.get<DashboardOverviewResponse>(
    dashboardEndpoints.overview,
    query
  )

  return response.data
}

async function fetchDashboardOperationalReports(
  params: DashboardOverviewParams
): Promise<OperationalReportsData> {
  const query: Record<string, string> = { period: params.period }

  if (params.from) {
    query.from = params.from
  }

  if (params.to) {
    query.to = params.to
  }

  if (params.fulfillment_branch_id !== undefined && params.fulfillment_branch_id !== null) {
    query.fulfillment_branch_id = String(params.fulfillment_branch_id)
  }

  const response = await api.get<OperationalReportsResponse>(
    dashboardEndpoints.operationalReports,
    query
  )

  return response.data
}

async function fetchDashboardCardDetails(
  card: string,
  params: DashboardOverviewParams
): Promise<TotalDeliveriesCardData> {
  const query: Record<string, string> = { period: params.period }

  if (params.from) {
    query.from = params.from
  }

  if (params.to) {
    query.to = params.to
  }

  if (params.fulfillment_branch_id !== undefined && params.fulfillment_branch_id !== null) {
    query.fulfillment_branch_id = String(params.fulfillment_branch_id)
  }

  const response = await api.get<TotalDeliveriesCardResponse>(
    dashboardEndpoints.cardDetails(card),
    query
  )

  return response.data
}

async function fetchDashboardRiderAnalytics(
  params: DashboardOverviewParams
): Promise<RiderAnalyticsData> {
  const query: Record<string, string> = { period: params.period }

  if (params.from) {
    query.from = params.from
  }

  if (params.to) {
    query.to = params.to
  }

  if (params.fulfillment_branch_id !== undefined && params.fulfillment_branch_id !== null) {
    query.fulfillment_branch_id = String(params.fulfillment_branch_id)
  }

  const response = await api.get<RiderAnalyticsResponse>(
    dashboardEndpoints.riderAnalytics,
    query
  )

  return response.data
}

async function fetchDashboardBnplAnalytics(
  params: DashboardOverviewParams
): Promise<BnplAnalyticsData> {
  const query: Record<string, string> = { period: params.period }

  if (params.from) {
    query.from = params.from
  }

  if (params.to) {
    query.to = params.to
  }

  if (params.fulfillment_branch_id !== undefined && params.fulfillment_branch_id !== null) {
    query.fulfillment_branch_id = String(params.fulfillment_branch_id)
  }

  const response = await api.get<BnplAnalyticsResponse>(
    dashboardEndpoints.bnplAnalytics,
    query
  )

  return response.data
}

export const dashboardQueries = {
  overview: (params: DashboardOverviewParams) =>
    queryOptions({
      queryKey: dashboardKeys.overview(params),
      queryFn: () => fetchDashboardOverview(params),
      placeholderData: (previous) => previous,
    }),
  operationalReports: (params: DashboardOverviewParams) =>
    queryOptions({
      queryKey: dashboardKeys.operationalReports(params),
      queryFn: () => fetchDashboardOperationalReports(params),
      placeholderData: (previous) => previous,
    }),
  riderAnalytics: (
    params: DashboardOverviewParams,
    enabled: boolean = true
  ) =>
    queryOptions({
      queryKey: dashboardKeys.riderAnalytics(params),
      queryFn: () => fetchDashboardRiderAnalytics(params),
      enabled,
      placeholderData: (previous) => previous,
    }),
  bnplAnalytics: (
    params: DashboardOverviewParams,
    enabled: boolean = true
  ) =>
    queryOptions({
      queryKey: dashboardKeys.bnplAnalytics(params),
      queryFn: () => fetchDashboardBnplAnalytics(params),
      enabled,
      placeholderData: (previous) => previous,
    }),
  cardDetails: (
    card: string,
    params: DashboardOverviewParams,
    enabled: boolean = true
  ) =>
    queryOptions({
      queryKey: dashboardKeys.cardDetails(card, params),
      queryFn: () => fetchDashboardCardDetails(card, params),
      enabled,
      placeholderData: (previous) => previous,
    }),
}


