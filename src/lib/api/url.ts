import { API_BASE_URL } from "@/constants/app"

type QueryParams = Record<string, string | number | boolean | undefined>
type BuildApiUrlArgs = {
  baseUrl?: string | null
  endpoint: string
  params?: QueryParams
}

function buildQueryString(params?: QueryParams) {
  if (!params) return ""

  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      query.append(key, String(value))
    }
  })

  const queryString = query.toString()
  return queryString ? `?${queryString}` : ""
}

export function buildApiUrl(endpoint: string, params?: QueryParams): string
export function buildApiUrl(
  baseUrl: string | null | undefined,
  endpoint: string,
  params?: QueryParams
): string
export function buildApiUrl(
  first: string | null | undefined,
  second?: string | QueryParams,
  third?: QueryParams
) {
  const args: BuildApiUrlArgs =
    typeof second === "string"
      ? { baseUrl: first, endpoint: second, params: third }
      : { endpoint: first ?? "", params: second }

  const resolvedBaseUrl = args.baseUrl || API_BASE_URL || ""
  const endpoint = args.endpoint
  const params = args.params
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  const url = `${resolvedBaseUrl}${path}`
  const queryString = buildQueryString(params)

  return `${url}${queryString}`
}
