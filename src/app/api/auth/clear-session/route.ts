import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { AUTH_COOKIE_NAME } from "@/constants/auth"

export async function GET(request: Request) {
  const cookieStore = await cookies()
  cookieStore.delete({
    name: AUTH_COOKIE_NAME,
    path: "/",
  })

  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("reason", "session-expired")

  return NextResponse.redirect(loginUrl)
}
