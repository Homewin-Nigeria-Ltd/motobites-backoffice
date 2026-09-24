import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { API_BASE_URL } from "@/constants/app"
import { AUTH_COOKIE_NAME } from "@/constants/auth"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null
  const apiUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    API_BASE_URL ||
    "https://motobitesbackend.staging-api.motopayng.com/api"

  return NextResponse.json({
    token,
    apiUrl,
  })
}
