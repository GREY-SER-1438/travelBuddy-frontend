import { Link } from "react-router-dom"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RegisterFormCard() {
  return (
    <section className="w-full max-w-[600px] rounded-[34px] border border-[#8DB5D6] bg-card px-6 py-5 shadow-[0_0_0_1px_rgba(44,71,92,0.06),0_14px_30px_rgba(44,71,92,0.14)] sm:px-8 sm:py-7">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#588096]">Создание аккаунта</p>
          <h1 className="mt-1 text-4xl leading-none font-bold text-foreground sm:text-6xl">
            Регистрация в TravelBuddy
          </h1>
        </div>

        <Button
          asChild
          variant="transparent"
          size="icon-lg"
          className="mt-1 rounded-2xl text-[#8DB5D6]"
          aria-label="Закрыть"
        >
          <Link to="/">
            <X className="size-5" />
          </Link>
        </Button>
      </header>

      <form className="space-y-3.5" action="#" method="post">
        <label className="block">
          <span className="sr-only">Имя пользователя</span>
          <input
            name="username"
            type="text"
            placeholder="Имя пользователя"
            className="h-12 w-full rounded-2xl border border-[#8DB5D6] bg-transparent px-4 text-base text-foreground placeholder:text-muted-foreground/80 focus:border-[#588096] focus:outline-none focus:ring-2 focus:ring-[#8DB5D6]/30"
          />
        </label>

        <label className="block">
          <span className="sr-only">Email или логин</span>
          <input
            name="email"
            type="text"
            placeholder="Email или логин"
            className="h-12 w-full rounded-2xl border border-[#8DB5D6] bg-transparent px-4 text-base text-foreground placeholder:text-muted-foreground/80 focus:border-[#588096] focus:outline-none focus:ring-2 focus:ring-[#8DB5D6]/30"
          />
        </label>

        <label className="block">
          <span className="sr-only">Пароль</span>
          <input
            name="password"
            type="password"
            placeholder="Пароль"
            className="h-12 w-full rounded-2xl border border-[#8DB5D6] bg-transparent px-4 text-base text-foreground placeholder:text-muted-foreground/80 focus:border-[#588096] focus:outline-none focus:ring-2 focus:ring-[#8DB5D6]/30"
          />
        </label>

        <label className="block">
          <span className="sr-only">Повторите пароль</span>
          <input
            name="repeatPassword"
            type="password"
            placeholder="Повторите пароль"
            className="h-12 w-full rounded-2xl border border-[#8DB5D6] bg-transparent px-4 text-base text-foreground placeholder:text-muted-foreground/80 focus:border-[#588096] focus:outline-none focus:ring-2 focus:ring-[#8DB5D6]/30"
          />
        </label>

        <Button
          type="submit"
          variant="orange"
          className="mt-1 h-12 w-full rounded-2xl text-2xl font-semibold"
        >
          Зарегистрироваться
        </Button>
      </form>

      <p className="mt-4 text-sm text-[#588096]">
        Уже есть аккаунт?{" "}
        <Link
          to="/login"
          className="font-semibold text-[#588096] transition-colors hover:text-foreground"
        >
          Войти
        </Link>
      </p>
    </section>
  )
}
