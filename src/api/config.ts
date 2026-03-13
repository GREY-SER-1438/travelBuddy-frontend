const envBase = String(import.meta.env.VITE_BASE_URL ?? "").trim()
const fallbackBase = import.meta.env.DEV ? "http://localhost:3000" : ""
const rawBase = envBase || fallbackBase

const withoutTrailingSlash = rawBase.replace(/\/+$/, "")
const withoutApiSuffix = withoutTrailingSlash.replace(/\/api$/i, "")

export const API_ORIGIN = withoutApiSuffix
export const API_BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : "/api"
