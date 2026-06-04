export function getInitials(name: string, fallback = "") {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2)

  return initials || fallback
}

export function getUserInitials(name: string, fallback = "SA") {
  return getInitials(name, fallback)
}
