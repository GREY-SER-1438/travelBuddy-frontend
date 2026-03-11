import { Plane } from "lucide-react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { logoutUser } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { hasAuthToken } from "@/lib/auth"

export function Header() {
  const navigate = useNavigate()
  const isAuthenticated = hasAuthToken()

  const navLinks = isAuthenticated
    ? [
        { to: "/", label: "Главная", end: true },
        { to: "/routes", label: "Маршруты" },
        { to: "/planner", label: "Планировщик" },
        { to: "/cabinet", label: "Кабинет" },
      ]
    : [{ to: "/", label: "Главная", end: true }]

  const handleLogout = () => {
    logoutUser()
    navigate("/login", { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Plane className="size-3.5 rotate-45" strokeWidth={2.3} />
          </span>
          <span className="text-base font-semibold text-foreground sm:text-lg">
            TravelBuddy
          </span>
        </Link>

        <nav className="flex flex-1 justify-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "inline-flex h-9 items-center rounded-full px-5 text-base font-medium transition-colors",
                    isActive
                      ? "bg-secondary/45 text-foreground"
                      : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {isAuthenticated ? (
          <div className="flex items-center gap-2 text-[#588096]">
            <Button asChild variant="transparent" size="headerAuth">
              <Link to="/cabinet">Профиль</Link>
            </Button>
            <Button
              type="button"
              variant="orange"
              size="headerAuth"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </div>
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
    </header>
  )
}
