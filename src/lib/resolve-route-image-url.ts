import { API_BASE_URL, API_ORIGIN } from "@/api/config"

export function resolveRouteImageUrl(imageUrl?: string | null) {
  const candidates = resolveRouteImageCandidates(imageUrl)
  return candidates[0]
}

export function resolveRouteImageCandidates(imageUrl?: string | null) {
  if (!imageUrl) return []

  const trimmed = imageUrl.trim()
  if (!trimmed) return []

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return [trimmed]
  }

  const normalizedPath = trimmed.replace(/^\/+/, "")
  if (!normalizedPath) return []

  if (normalizedPath.toLowerCase().startsWith("api/")) {
    return [`${API_ORIGIN}/${normalizedPath}`]
  }

  return [
    `${API_ORIGIN}/${normalizedPath}`,
    `${API_BASE_URL}/${normalizedPath}`,
  ]
}
