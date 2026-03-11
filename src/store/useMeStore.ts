import { create } from "zustand"
import { instance } from "@/api/instance"

export interface Me {
  count_users: number
  id: number
  percent: number
}

export interface meStore {
  me: Me | null
  loading: boolean
  error: string | null
  getme: () => Promise<void>
}

export const usemeStore = create<meStore>((set, get) => ({
  me: null,
  loading: false,
  error: null,

  getme: async () => {
    if (get().loading) return

    set({ loading: true, error: null })
    try {
      const response = await instance.get<Me>("/user/me")
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
