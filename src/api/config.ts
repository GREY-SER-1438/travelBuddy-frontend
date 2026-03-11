const rawBase = String(import.meta.env.VITE_BASE_URL ?? "").trim()
const withoutTrailingSlash = rawBase.replace(/\/+$/, "")
const withoutApiSuffix = withoutTrailingSlash.replace(/\/api$/i, "")

export const API_ORIGIN = withoutApiSuffix
export const API_BASE_URL = `${API_ORIGIN}/api`
