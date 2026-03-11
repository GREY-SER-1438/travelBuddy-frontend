import { create } from "zustand"
import { instance } from "@/api/instance"

export interface Me {
  count_users: number
  id: number
  percent: number
}

export interface MeStore {
  me: Me | null
  loading: boolean
  error: string | null
  getMe: () => Promise<void>
}

export const useMeStore = create<MeStore>((set, get) => ({
  me: null,
  loading: false,
  error: null,

  getMe: async () => {
    if (get().loading) return

    set({ loading: true, error: null })
    try {
      const response = await instance.get<Me>("/users/me")
      set({ loading: false, me: response.data })
    } catch (e) {
      console.error(e)
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Ошибка загрузки",
      })
    }
  },
}))

// Backward compatibility alias
export const usemeStore = useMeStore
