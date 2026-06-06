export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type QueryParams = Record<string, string | number | boolean | undefined>

type RequestOptions<TBody> = {
  method?: HttpMethod
  body?: TBody
  headers?: Record<string, string>
  params?: QueryParams
}

function buildUrl(endpoint: string, params?: QueryParams) {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`

  if (!params) return path

  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      query.append(key, String(value))
    }
  })

  const queryString = query.toString()
  return queryString ? `${path}?${queryString}` : path
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
  const { method = "GET", body, headers = {}, params } = options
  const url = buildUrl(endpoint, params)

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
  get: <T>(endpoint: string, params?: QueryParams) =>
    request<T>(endpoint, { method: "GET", params }),

  post: <T, B = unknown>(endpoint: string, body: B) =>
    request<T, B>(endpoint, { method: "POST", body }),

  put: <T, B = unknown>(endpoint: string, body: B) =>
    request<T, B>(endpoint, { method: "PUT", body }),

  patch: <T, B = unknown>(endpoint: string, body: B) =>
    request<T, B>(endpoint, { method: "PATCH", body }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
}
