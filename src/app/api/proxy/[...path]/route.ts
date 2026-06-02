import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { API_BASE_URL } from "@/constants/app"
import { AUTH_COOKIE_NAME } from "@/constants/auth"
import { buildApiUrl } from "@/lib/api/url"

type RouteContext = {
  params: Promise<{ path: string[] }>
}

async function forwardRequest(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { success: false, message: "API_BASE_URL is not configured" },
      { status: 500 }
    )
  }

  const { path } = await context.params
  const endpoint = `/${path.join("/")}`

  const queryParams: Record<string, string> = {}
  request.nextUrl.searchParams.forEach((value, key) => {
    queryParams[key] = value
  })

  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const existingAuthHeader = request.headers.get("authorization")

  const contentType = request.headers.get("content-type")
  const accepts = request.headers.get("accept")
  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer()

  const response = await fetch(buildApiUrl(endpoint, queryParams), {
    method: request.method,
    headers: {
      ...(accepts ? { Accept: accepts } : {}),
      ...(contentType ? { "Content-Type": contentType } : {}),
      ...(existingAuthHeader
        ? { Authorization: existingAuthHeader }
        : token
          ? { Authorization: `Bearer ${token}` }
          : {}),
    },
    body,
    cache: "no-store",
  })

  const responseContentType = response.headers.get("content-type") ?? "application/json"
  const responseBody = await response.text()

  return new NextResponse(responseBody, {
    status: response.status,
    headers: { "Content-Type": responseContentType },
  })
}

export async function GET(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context)
}

export async function POST(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context)
}

export async function OPTIONS(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context)
}
