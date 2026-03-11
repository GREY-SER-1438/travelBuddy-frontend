import { create } from "zustand"
import { instance } from "@/api/instance"

export type RouteAuthor = {
  userId: number
  email: string
  username: string
}

export type RouteItem = {
  routeId: number
  title: string
  description: string | null
  imageUrl: string | null
  visibility: "public" | "private" | string
  durationDays: number | null
  isCompleted: boolean
  author: RouteAuthor
}

type RoutesStore = {
  routes: RouteItem[]
  loading: boolean
  loaded: boolean
  lastCategory: string | null
  error: string | null
  getRoutes: (category?: string) => Promise<void>
}

export const useRoutesStore = create<RoutesStore>((set, get) => ({
  routes: [],
  loading: false,
  loaded: false,
  lastCategory: null,
  error: null,

  getRoutes: async (category) => {
    const normalizedCategory = category?.trim() || null
    const state = get()

    if (state.loading) return

    set({ loading: true, error: null })

    try {
      const response = await instance.get("/routes", {
        params: normalizedCategory ? { category: normalizedCategory } : undefined,
      })

      const routes = normalizeRoutesPayload(response.data)
      set({
        routes,
        loading: false,
        loaded: true,
        lastCategory: normalizedCategory,
        error: null,
      })
    } catch (error) {
      set({
        loading: false,
        loaded: true,
        lastCategory: normalizedCategory,
        error:
          error instanceof Error ? error.message : "Ошибка загрузки маршрутов",
      })
    }
  },
}))

function normalizeRoutesPayload(payload: unknown): RouteItem[] {
  if (Array.isArray(payload)) {
    return payload as RouteItem[]
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>

    if (Array.isArray(record.routes)) {
      return record.routes as RouteItem[]
    }

    if (Array.isArray(record.data)) {
      return record.data as RouteItem[]
    }
  }

  return []
}
