let cachedAuth: { token: string | null; apiUrl: string } | null = null

export async function getDirectUploadConfig(): Promise<{
  token: string | null
  apiUrl: string
}> {
  if (cachedAuth?.token) {
    return cachedAuth
  }

  try {
    const res = await fetch("/api/auth/token", { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      cachedAuth = {
        token: data.token ?? null,
        apiUrl:
          data.apiUrl ||
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://motobitesbackend.staging-api.motopayng.com/api",
      }
      return cachedAuth
    }
  } catch {
    // fallback if fetch fails
  }

  return {
    token: null,
    apiUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://motobitesbackend.staging-api.motopayng.com/api",
  }
}

export function clearDirectUploadConfigCache() {
  cachedAuth = null
}
