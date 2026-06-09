import { staffEndpoints } from "../api/endpoints"

function getFilenameFromDisposition(header: string | null) {
  if (!header) {
    return null
  }

  const match = header.match(/filename="?([^"]+)"?/i)
  return match?.[1] ?? null
}

export async function downloadStaffCsv() {
  const response = await fetch(staffEndpoints.export, {
    method: "GET",
    credentials: "include",
  })

  if (!response.ok) {
    let message = "Failed to export staff CSV"

    try {
      const data = (await response.json()) as { message?: string }
      if (data.message) {
        message = data.message
      }
    } catch {
      // ignore invalid JSON
    }

    throw new Error(message)
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  const filename =
    getFilenameFromDisposition(response.headers.get("content-disposition")) ??
    `staff-export-${new Date().toISOString().slice(0, 10)}.csv`

  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
