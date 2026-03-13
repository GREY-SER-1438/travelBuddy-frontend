import { useEffect, useState } from "react"
import { Menu, Moon, Sun, X } from "lucide-react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { logoutUser } from "@/api/auth"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { hasAuthToken } from "@/lib/auth"

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isAuthenticated = hasAuthToken()
  const { theme, setTheme } = useTheme()

  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme
  const isDark = resolvedTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  const navLinks = isAuthenticated
    ? [
        { to: "/", label: "Главная", end: true },
        { to: "/routes", label: "Маршруты", end: true },
        { to: "/cabinet/my-routes", label: "Личные маршруты" },
        { to: "/planner", label: "Планировщик" },
        { to: "/cabinet", label: "Кабинет", end: true },
      ]
    : [{ to: "/", label: "Главная", end: true }]

  useEffect(() => {
    if (!isMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMenuOpen])

  const handleLogout = () => {
    logoutUser()
    setIsMenuOpen(false)
    navigate("/login", { replace: true })
  }

  const isMobileItemActive = (to: string, end?: boolean) => {
    if (end) return location.pathname === to
    return location.pathname === to || location.pathname.startsWith(`${to}/`)
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#9bbddd]/50 bg-[#f3f7fb]/95 backdrop-blur supports-[backdrop-filter]:bg-[#f3f7fb]/90 dark:border-[#588096]/40 dark:bg-[#1e2f3c]/95 dark:supports-[backdrop-filter]:bg-[#1e2f3c]/90">
        <div className="mx-auto w-full max-w-[1600px] px-3 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 rounded-2xl border border-[#9bbddd] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(44,71,92,0.08)] dark:border-[#588096]/50 dark:bg-[#243847] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f59a23] text-xl font-bold text-white">
                TB
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xl leading-none font-bold text-[#2c475c] dark:text-[#fbfbfd] sm:text-3xl">
                  TravelBuddy
                </span>
                <span className="block truncate text-[0.72rem] text-[#588096] dark:text-[#8db5d6] sm:text-base">
                  Планируй поездки удобно
                </span>
              </span>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-2 xl:flex">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      "inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors",
                      isActive
                        ? "bg-[#dbe7f3] text-[#2c475c] dark:bg-[#35556b] dark:text-[#fbfbfd]"
                        : "text-[#4f6a80] hover:bg-[#e8f0f8] dark:text-[#c8dded] dark:hover:bg-[#35556b]",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <Button
              type="button"
              variant="transparent"
              size="icon-lg"
              className="ml-auto rounded-2xl border-[#9bbddd] text-[#2c475c] dark:border-[#588096] dark:text-[#e9f1fd] xl:hidden"
              aria-label={isDark ? "Включить светлую тему" : "Включить темную тему"}
              onClick={toggleTheme}
            >
              {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>

            <Button
              type="button"
              variant="transparent"
              size="icon-lg"
              className="rounded-2xl border-[#9bbddd] text-[#2c475c] dark:border-[#588096] dark:text-[#e9f1fd] xl:hidden"
              aria-label="Открыть меню"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="size-6" />
            </Button>

            <div className="ml-auto hidden items-center gap-2 xl:flex">
              <Button
                type="button"
                variant="transparent"
                size="headerAuth"
                className="border-[#9bbddd] text-[#2c475c] dark:border-[#588096] dark:text-[#e9f1fd]"
                aria-label={isDark ? "Включить светлую тему" : "Включить темную тему"}
                onClick={toggleTheme}
              >
                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {isDark ? "Светлая" : "Тёмная"}
              </Button>
              {isAuthenticated ? (
                <Button
                  type="button"
                  variant="orange"
                  size="headerAuth"
                  onClick={handleLogout}
                >
                  Выйти
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-[#588096]">
                  <Button asChild variant="transparent" size="headerAuth">
                    <Link to="/login">Вход</Link>
                  </Button>
                  <Button asChild variant="orange" size="headerAuth">
                    <Link to="/register">Регистрация</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
            aria-label="Закрыть меню"
            onClick={() => setIsMenuOpen(false)}
          />

          <aside className="absolute inset-y-0 right-0 flex w-[min(88vw,420px)] flex-col overflow-hidden border-l border-[#9bbddd] bg-[#f5f7fb] shadow-[-16px_0_40px_rgba(0,0,0,0.35)] dark:border-[#588096]/50 dark:bg-[#243847]">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f59a23] text-xl font-bold text-white">
                  TB
                </span>
                <div className="min-w-0">
                  <p className="truncate text-2xl leading-none font-bold text-[#2c475c] dark:text-[#fbfbfd] sm:text-3xl">
                    TravelBuddy
                  </p>
                  <p className="truncate text-base text-[#588096] dark:text-[#8db5d6] sm:text-xl">Меню</p>
                </div>
              </div>
              <Button
                type="button"
                variant="transparent"
                size="icon-lg"
                className="rounded-2xl border-[#9bbddd] text-[#588096]"
                aria-label="Закрыть меню"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="size-6" />
              </Button>
            </div>

            <div className="h-px w-full bg-[#9bbddd]/70" />

            <div className="flex h-full flex-col px-4 pt-4 pb-5">
              <Button
                type="button"
                variant="transparent"
                size="headerAuth"
                className="mb-3 w-full justify-center border-[#9bbddd] text-[#2c475c] dark:border-[#588096] dark:text-[#e9f1fd]"
                aria-label={isDark ? "Включить светлую тему" : "Включить темную тему"}
                onClick={toggleTheme}
              >
                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {isDark ? "Светлая тема" : "Тёмная тема"}
              </Button>
              <nav className="space-y-2">
                {navLinks.map((item) => (
                  <Button
                    key={item.to}
                    asChild
                    variant="transparent"
                    size="headerAuth"
                    className={[
                      "w-full justify-start",
                      isMobileItemActive(item.to, item.end)
                        ? "bg-[#dbe7f3] text-[#2c475c]"
                        : "border-[#9bbddd] text-[#4f6a80]",
                    ].join(" ")}
                  >
                    <Link to={item.to} onClick={() => setIsMenuOpen(false)}>
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </nav>

              <div className="mt-auto space-y-2 pt-6">
                {isAuthenticated ? (
                  <Button
                    variant="orange"
                    size="headerAuth"
                    className="w-full justify-center"
                    onClick={handleLogout}
                  >
                    Выйти
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="transparent"
                      size="headerAuth"
                      className="w-full justify-center border-[#9bbddd] text-[#4f6a80]"
                    >
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        Вход
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="orange"
                      size="headerAuth"
                      className="w-full justify-center"
                    >
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                        Регистрация
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  )
}
