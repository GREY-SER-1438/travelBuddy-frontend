import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import { z } from "zod"
import { loginUser } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { getRequestError } from "@/lib/get-request-error"

const loginSchema = z.object({
  email: z.string().trim().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
})

type LoginFormValues = z.infer<typeof loginSchema>

type LoginFieldErrors = Partial<Record<keyof LoginFormValues, string>>

export function LoginFormCard() {
  const navigate = useNavigate()
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  })
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [requestError, setRequestError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setRequestError(null)

    const parsed = loginSchema.safeParse(values)

    if (!parsed.success) {
      const nextFieldErrors: LoginFieldErrors = {}

      for (const issue of parsed.error.issues) {
        const path = issue.path[0]
        if (typeof path === "string" && !(path in nextFieldErrors)) {
          nextFieldErrors[path as keyof LoginFormValues] = issue.message
        }
      }

      setFieldErrors(nextFieldErrors)
      return
    }

    setFieldErrors({})
    setLoading(true)

    try {
      await loginUser(parsed.data)
      navigate("/", { replace: true })
    } catch (error) {
      setRequestError(getRequestError(error))
    } finally {
      setLoading(false)
    }
  }

  const updateValue = (field: keyof LoginFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    setRequestError(null)
  }

  return (
    <section className="w-full max-w-[600px] rounded-[34px] border border-[#8DB5D6] bg-card px-6 py-5 shadow-[0_0_0_1px_rgba(44,71,92,0.06),0_14px_30px_rgba(44,71,92,0.14)] sm:px-8 sm:py-7">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#588096]">Авторизация</p>
          <h1 className="mt-1 text-4xl leading-none font-bold text-foreground sm:text-6xl">
            Вход в TravelBuddy
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

      <form className="space-y-3.5" onSubmit={onSubmit} noValidate>
        <label className="block">
          <span className="sr-only">Email</span>
          <input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            className="h-12 w-full rounded-2xl border border-[#8DB5D6] bg-transparent px-4 text-base text-foreground placeholder:text-muted-foreground/80 focus:border-[#588096] focus:outline-none focus:ring-2 focus:ring-[#8DB5D6]/30"
          />
          {fieldErrors.email ? (
            <p className="mt-1 text-sm text-destructive">{fieldErrors.email}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="sr-only">Пароль</span>
          <input
            name="password"
            type="password"
            placeholder="Пароль"
            autoComplete="current-password"
            value={values.password}
            onChange={(event) => updateValue("password", event.target.value)}
            className="h-12 w-full rounded-2xl border border-[#8DB5D6] bg-transparent px-4 text-base text-foreground placeholder:text-muted-foreground/80 focus:border-[#588096] focus:outline-none focus:ring-2 focus:ring-[#8DB5D6]/30"
          />
          {fieldErrors.password ? (
            <p className="mt-1 text-sm text-destructive">
              {fieldErrors.password}
            </p>
          ) : null}
        </label>

        {requestError ? (
          <p className="text-sm text-destructive" role="alert">
            {requestError}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="orange"
          disabled={loading}
          className="mt-1 h-12 w-full rounded-2xl text-2xl font-semibold"
        >
          {loading ? "Входим..." : "Войти"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-[#588096]">
        Нет аккаунта?{" "}
        <Link
          to="/register"
          className="font-semibold text-[#588096] transition-colors hover:text-foreground"
        >
          Зарегистрироваться
        </Link>
      </p>
    </section>
  )
}
