import { create } from "zustand"
import { getCurrentUserProfile } from "@/api/users"
import type { JwtUserDto } from "@/api/types"
import { getRequestError } from "@/lib/get-request-error"

export interface MeStore {
  me: JwtUserDto | null
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
      const me = await getCurrentUserProfile()
      set({ loading: false, me })
    } catch (error) {
      set({
        loading: false,
        error: getRequestError(error),
      })
    }
  },
}))

// Backward compatibility alias
export const usemeStore = useMeStore
