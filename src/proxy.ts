import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { AUTH_COOKIE_NAME } from "@/constants/auth"

const PUBLIC_PATHS = ["/login"]

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/order",
  "/menu",
  "/kitchen",
  "/staff",
  "/customers",
  "/revenue-analytics",
  "/inventory",
  "/delivery",
  "/riders",
  "/performance",
  "/technical-report",
  "/admin",
  "/ticket",
  "/settings",
]

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const { pathname } = request.nextUrl

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(token ? "/dashboard" : "/login", request.url)
    )
  }

  if (pathname === "/inventory-tracking" || pathname.startsWith("/inventory-tracking/")) {
    const nextPath = pathname.replace("/inventory-tracking", "/inventory")
    return NextResponse.redirect(new URL(nextPath, request.url))
  }

  if (pathname === "/delivery-status/riders" || pathname.startsWith("/delivery-status/riders/")) {
    const nextPath = pathname.replace("/delivery-status/riders", "/riders")
    return NextResponse.redirect(new URL(nextPath, request.url))
  }

  if (pathname === "/delivery-status" || pathname.startsWith("/delivery-status/")) {
    const nextPath = pathname.replace("/delivery-status", "/delivery")
    return NextResponse.redirect(new URL(nextPath, request.url))
  }

  if (pathname === "/rider-chat" || pathname.startsWith("/rider-chat/")) {
    const nextUrl = new URL("/riders/chat", request.url)
    nextUrl.search = request.nextUrl.search
    return NextResponse.redirect(nextUrl)
  }

  if (pathname === "/admin/customers/chats" || pathname.startsWith("/admin/customers/chats/")) {
    const nextUrl = new URL("/customers/chats", request.url)
    nextUrl.search = request.nextUrl.search
    return NextResponse.redirect(nextUrl)
  }

  if (pathname === "/admin/customers/tickets/list" || pathname.startsWith("/admin/customers/tickets/list/")) {
    return NextResponse.redirect(new URL("/customers/tickets/list", request.url))
  }

  if (pathname === "/admin/customers/tickets" || pathname.startsWith("/admin/customers/tickets/")) {
    return NextResponse.redirect(new URL("/customers/tickets", request.url))
  }

  if (pathname === "/ticket/chat" || pathname.startsWith("/ticket/chat/")) {
    const nextUrl = new URL("/customers/chats", request.url)
    nextUrl.search = request.nextUrl.search
    return NextResponse.redirect(nextUrl)
  }

  if (pathname === "/ticket/list" || pathname.startsWith("/ticket/list/")) {
    return NextResponse.redirect(new URL("/customers/tickets/list", request.url))
  }

  if (pathname === "/ticket" || pathname.startsWith("/ticket/")) {
    return NextResponse.redirect(new URL("/customers/tickets", request.url))
  }

  if (pathname === "/customer-support" || pathname.startsWith("/customer-support/")) {
    const nextPath = pathname
      .replace("/customer-support/tickets/list", "/customers/tickets/list")
      .replace("/customer-support/tickets", "/customers/tickets")
      .replace("/customer-support", "/customers/tickets")
    return NextResponse.redirect(new URL(nextPath, request.url))
  }

  if (isProtectedPath(pathname) && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (token && isPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
