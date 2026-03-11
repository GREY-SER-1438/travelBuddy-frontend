import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import { z } from "zod"
import { registerUser } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { getRequestError } from "@/lib/get-request-error"

const registerSchema = z
  .object({
    username: z.string().trim().min(2, "Введите имя пользователя"),
    email: z.string().trim().email("Введите корректный email"),
    password: z.string().min(6, "Минимум 6 символов"),
    repeatPassword: z.string().min(1, "Повторите пароль"),
  })
  .refine((value) => value.password === value.repeatPassword, {
    path: ["repeatPassword"],
    message: "Пароли не совпадают",
  })

type RegisterFormValues = z.infer<typeof registerSchema>

type RegisterFieldErrors = Partial<Record<keyof RegisterFormValues, string>>

export function RegisterFormCard() {
  const navigate = useNavigate()
  const [values, setValues] = useState<RegisterFormValues>({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  })
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({})
  const [requestError, setRequestError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setRequestError(null)

    const parsed = registerSchema.safeParse(values)

    if (!parsed.success) {
      const nextFieldErrors: RegisterFieldErrors = {}

      for (const issue of parsed.error.issues) {
        const path = issue.path[0]
        if (typeof path === "string" && !(path in nextFieldErrors)) {
          nextFieldErrors[path as keyof RegisterFormValues] = issue.message
        }
      }

      setFieldErrors(nextFieldErrors)
      return
    }

    setFieldErrors({})
    setLoading(true)

    try {
      await registerUser({
        username: parsed.data.username,
        email: parsed.data.email,
        password: parsed.data.password,
      })
      navigate("/login", { replace: true })
    } catch (error) {
      setRequestError(getRequestError(error))
    } finally {
      setLoading(false)
    }
  }

  const updateValue = (field: keyof RegisterFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    setRequestError(null)
  }

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

      <form className="space-y-3.5" onSubmit={onSubmit} noValidate>
        <label className="block">
          <span className="sr-only">Имя пользователя</span>
          <input
            name="username"
            type="text"
            placeholder="Имя пользователя"
            autoComplete="username"
            value={values.username}
            onChange={(event) => updateValue("username", event.target.value)}
            className="h-12 w-full rounded-2xl border border-[#8DB5D6] bg-transparent px-4 text-base text-foreground placeholder:text-muted-foreground/80 focus:border-[#588096] focus:outline-none focus:ring-2 focus:ring-[#8DB5D6]/30"
          />
          {fieldErrors.username ? (
            <p className="mt-1 text-sm text-destructive">
              {fieldErrors.username}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="sr-only">Email или логин</span>
          <input
            name="email"
            type="email"
            placeholder="Email или логин"
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
            autoComplete="new-password"
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

        <label className="block">
          <span className="sr-only">Повторите пароль</span>
          <input
            name="repeatPassword"
            type="password"
            placeholder="Повторите пароль"
            autoComplete="new-password"
            value={values.repeatPassword}
            onChange={(event) =>
              updateValue("repeatPassword", event.target.value)
            }
            className="h-12 w-full rounded-2xl border border-[#8DB5D6] bg-transparent px-4 text-base text-foreground placeholder:text-muted-foreground/80 focus:border-[#588096] focus:outline-none focus:ring-2 focus:ring-[#8DB5D6]/30"
          />
          {fieldErrors.repeatPassword ? (
            <p className="mt-1 text-sm text-destructive">
              {fieldErrors.repeatPassword}
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
          {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
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
