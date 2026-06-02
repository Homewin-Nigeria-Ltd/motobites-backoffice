import "server-only"

import { cookies } from "next/headers"

import { buildApiUrl } from "@/lib/api/url"
import { AUTH_COOKIE_NAME } from "@/constants/auth"
import {
  ApiError,
  type HttpMethod,
  type QueryParams,
} from "@/lib/api/client"

type ServerRequestOptions = {
  method?: HttpMethod
  body?: unknown
  params?: QueryParams
  auth?: boolean
  token?: string | null
}

type ApiEnvelope<T> = {
  success?: boolean
  data?: T
  message?: string
}

function getErrorMessage(data: unknown, fallback: string) {
  if (!data || typeof data !== "object") {
    return fallback
  }

  const record = data as Record<string, unknown>

  if (typeof record.message === "string" && record.message) {
    return record.message
  }

  const errors = record.errors
  if (errors && typeof errors === "object") {
    const first = Object.values(errors as Record<string, unknown[]>)[0]?.[0]
    if (typeof first === "string") {
      return first
    }
  }

  return fallback
}

function unwrapData<T>(payload: ApiEnvelope<T>): T {
  if (payload.data !== undefined) {
    return payload.data
  }

  return payload as T
}

async function serverRequest<T>(
  endpoint: string,
  options: ServerRequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    params,
    auth = true,
    token: explicitToken,
  } = options

  let token = explicitToken
  if (auth && token === undefined) {
    const cookieStore = await cookies()
    token = cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(buildApiUrl(endpoint, params), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  })

  let data: unknown = null

  try {
    data = await res.json()
  } catch {
    // ignore invalid JSON
  }

  if (!res.ok) {
    throw new ApiError(
      getErrorMessage(data, "Request failed"),
      res.status,
      data
    )
  }

  if (res.status === 204 || data === null) {
    return undefined as T
  }

  const envelope = data as ApiEnvelope<T>

  if (envelope.success === false) {
    throw new ApiError(
      getErrorMessage(data, "Request failed"),
      res.status,
      data
    )
  }

  return unwrapData(envelope)
}

type ApiServerRequestOptions = {
  auth?: boolean
  token?: string | null
}

export const apiServer = {
  get: <T>(endpoint: string, params?: QueryParams, options?: ApiServerRequestOptions) =>
    serverRequest<T>(endpoint, { method: "GET", params, ...options }),

  post: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: ApiServerRequestOptions
  ) => serverRequest<T>(endpoint, { method: "POST", body, ...options }),

  put: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: ApiServerRequestOptions
  ) => serverRequest<T>(endpoint, { method: "PUT", body, ...options }),

  patch: <T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: ApiServerRequestOptions
  ) => serverRequest<T>(endpoint, { method: "PATCH", body, ...options }),

  delete: <T>(endpoint: string, options?: ApiServerRequestOptions) =>
    serverRequest<T>(endpoint, { method: "DELETE", ...options }),
}
