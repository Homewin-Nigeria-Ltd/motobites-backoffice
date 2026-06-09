import { buildApiUrl } from "@/lib/api/url"

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type QueryParams = Record<string, string | number | boolean | undefined>

export type ApiRequestOptions = {
  baseUrl?: string | null
}

type RequestOptions<TBody> = ApiRequestOptions & {
  method?: HttpMethod
  body?: TBody
  headers?: Record<string, string>
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

function buildUrl(
  endpoint: string,
  params?: QueryParams,
  baseUrl?: string | null
) {
  if (baseUrl) {
    return buildApiUrl(baseUrl, endpoint, params)
  }

  const queryString = buildQueryString(params)

  if (/^https?:\/\//.test(endpoint)) {
    return `${endpoint}${queryString}`
  }

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  return `${path}${queryString}`
}

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

export async function request<TResponse, TBody = unknown>(
  endpoint: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const { method = "GET", body, headers = {}, params, baseUrl } = options
  const url = buildUrl(endpoint, params, baseUrl)

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData

  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
  })

  let data: unknown = null

  try {
    data = await res.json()
  } catch {
    // ignore invalid JSON
  }

  if (!res.ok) {
    throw new ApiError(
      (data as { message?: string })?.message || "Request failed",
      res.status,
      data
    )
  }

  if (res.status === 204) {
    return undefined as TResponse
  }

  return data as TResponse
}

export const api = {
  get: <T>(endpoint: string, params?: QueryParams, options?: ApiRequestOptions) =>
    request<T>(endpoint, { method: "GET", params, ...options }),

  post: <T, B = unknown>(
    endpoint: string,
    body: B,
    options?: ApiRequestOptions
  ) => request<T, B>(endpoint, { method: "POST", body, ...options }),

  put: <T, B = unknown>(
    endpoint: string,
    body: B,
    options?: ApiRequestOptions
  ) => request<T, B>(endpoint, { method: "PUT", body, ...options }),

  patch: <T, B = unknown>(
    endpoint: string,
    body: B,
    options?: ApiRequestOptions
  ) => request<T, B>(endpoint, { method: "PATCH", body, ...options }),

  delete: <T>(endpoint: string, options?: ApiRequestOptions) =>
    request<T>(endpoint, { method: "DELETE", ...options }),
}
