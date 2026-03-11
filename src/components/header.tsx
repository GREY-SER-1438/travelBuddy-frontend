import { Plane } from "lucide-react"
import { Link, NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Plane className="size-3 rotate-45" strokeWidth={2.3} />
          </span>
          <span className="text-sm font-semibold text-foreground sm:text-base">
            TravelBuddy
          </span>
        </Link>

        <nav className="flex flex-1 justify-center">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              [
                "inline-flex h-8 items-center rounded-full px-4 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary/45 text-foreground"
                  : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground",
              ].join(" ")
            }
          >
            Главная
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 text-[#588096]">
          <Button
            asChild
            variant="transparent"
            size="headerAuth"
          >
            <Link to="/login">Вход</Link>
          </Button>
          <Button
            asChild
            variant="orange"
            size="headerAuth"
          >
            <Link to="/register">Регистрация</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
