export function formatStaffDate(isoDate: string) {
  const date = new Date(isoDate)
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const timePart = date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(" ", "")
  return `${datePart} | ${timePart}`
}
