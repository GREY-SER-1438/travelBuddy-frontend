import { useEffect } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { logoutUser } from "@/api/auth"
import { hasAuthToken } from "@/lib/auth"
import { useMeStore } from "@/store/useMeStore"

function AuthGuardFallback() {
  return (
    <div className="mx-auto flex min-h-[40vh] w-full max-w-[1280px] items-center justify-center px-4 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground sm:text-base">Проверяем сессию...</p>
    </div>
  )
}

export function RequireAuth() {
  const location = useLocation()
  const hasToken = hasAuthToken()
  const me = useMeStore((state) => state.me)
  const loading = useMeStore((state) => state.loading)
  const error = useMeStore((state) => state.error)
  const getMe = useMeStore((state) => state.getMe)

  useEffect(() => {
    if (hasToken && !me && !loading && !error) {
      void getMe()
    }
  }, [error, getMe, hasToken, loading, me])

  useEffect(() => {
    if (hasToken && error) {
      logoutUser()
    }
  }, [error, hasToken])

  if (!hasToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (loading || (hasToken && !me && !error)) {
    return <AuthGuardFallback />
  }

  if (error) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function RequireGuest() {
  const hasToken = hasAuthToken()
  const me = useMeStore((state) => state.me)
  const loading = useMeStore((state) => state.loading)
  const error = useMeStore((state) => state.error)
  const getMe = useMeStore((state) => state.getMe)

  useEffect(() => {
    if (hasToken && !me && !loading && !error) {
      void getMe()
    }
  }, [error, getMe, hasToken, loading, me])

  useEffect(() => {
    if (hasToken && error) {
      logoutUser()
    }
  }, [error, hasToken])

  if (!hasToken) {
    return <Outlet />
  }

  if (loading || (hasToken && !me && !error)) {
    return <AuthGuardFallback />
  }

  if (me) {
    return <Navigate to="/" replace />
  }

  if (error) {
    return <Outlet />
  }

  return <Outlet />
}
