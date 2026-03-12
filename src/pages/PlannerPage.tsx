import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  addCategoryToRoute,
  createRoute,
  uploadRouteImage,
} from "@/api/routes"
import { createCategory, getCategories } from "@/api/categories"
import type { CategoryResponseDto } from "@/api/types"
import { getRequestError } from "@/lib/get-request-error"

type DateValidationResult = {
  valid: boolean
  durationDays: number | null
  message?: string
}

export default function PlannerPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [categories, setCategories] = useState<CategoryResponseDto[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [customCategoryName, setCustomCategoryName] = useState("")
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryLoadError, setCategoryLoadError] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadCategories = async () => {
      setLoadingCategories(true)
      setCategoryLoadError("")
      try {
        const data = await getCategories()
        if (cancelled) return
        setCategories(data)
      } catch (error) {
        if (cancelled) return
        setCategoryLoadError(getRequestError(error))
      } finally {
        if (!cancelled) {
          setLoadingCategories(false)
        }
      }
    }

    void loadCategories()

    return () => {
      cancelled = true
    }
  }, [])

  const saveRoute = async (visibility: "private" | "public") => {
    const normalizedTitle = title.trim()
    if (!normalizedTitle) {
      toast.error("Укажите название маршрута.")
      return
    }

    const dateValidation = validateDates(startDate, endDate)
    if (!dateValidation.valid) {
      toast.error(dateValidation.message || "Проверьте даты маршрута.")
      return
    }

    setSaving(true)

    try {
      let uploadedImageUrl: string | undefined
      if (imageFile) {
        const uploaded = await uploadRouteImage(imageFile)
        uploadedImageUrl = uploaded.imageUrl
      }

      const route = await createRoute({
        title: normalizedTitle,
        description: shortDescription.trim() || description.trim() || undefined,
        imageUrl: uploadedImageUrl,
        durationDays: dateValidation.durationDays ?? undefined,
        visibility,
      })

      const selectedCategory = categories.find(
        (item) => String(item.categoryId) === selectedCategoryId
      )
      const normalizedCategory =
        selectedCategoryId === "custom"
          ? customCategoryName.trim()
          : (selectedCategory?.name || "").trim()
      if (normalizedCategory) {
        const existingCategory =
          selectedCategory ??
          categories.find(
          (item) => item.name.trim().toLowerCase() === normalizedCategory.toLowerCase()
        )
        const categoryId = existingCategory
          ? existingCategory.categoryId
          : (
              await createCategory({
                name: normalizedCategory,
                isPublic: visibility === "public",
              })
            ).categoryId

        await addCategoryToRoute(route.routeId, { categoryId })
      }

      toast.success(`Маршрут #${route.routeId} успешно создан.`)
      navigate(`/cabinet/my-routes/${route.routeId}`)
    } catch (requestError) {
      toast.error(getRequestError(requestError))
    } finally {
      setSaving(false)
    }
  }

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setImageFile(null)
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Можно загрузить только изображение.")
      event.target.value = ""
      setImageFile(null)
      return
    }

    setImageFile(file)
  }

  const onStartDateChange = (value: string) => {
    setStartDate(value)
    if (endDate && value && endDate < value) {
      setEndDate(value)
    }
  }

  const onEndDateChange = (value: string) => {
    if (startDate && value && value < startDate) {
      setEndDate(startDate)
      return
    }
    setEndDate(value)
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <section className="rounded-[26px] border border-border bg-card p-5 shadow-[0_12px_24px_rgba(44,71,92,0.08)] sm:p-6">
          <p className="text-sm font-semibold text-muted-foreground">Планировщик</p>
          <h1 className="mt-1 text-5xl leading-none font-bold text-foreground sm:text-6xl">
            Конструктор маршрута
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Сначала создайте маршрут, затем добавляйте точки на странице маршрута в
            личном кабинете.
          </p>

          <form
            className="mt-5 space-y-3.5"
            onSubmit={(event) => {
              event.preventDefault()
              void saveRoute("private")
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Название маршрута"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-11 rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <div className="space-y-2">
                <select
                  value={selectedCategoryId}
                  onChange={(event) => setSelectedCategoryId(event.target.value)}
                  className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                >
                  <option value="">
                    {loadingCategories
                      ? "Загрузка категорий..."
                      : "Категория (не выбрана)"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={String(category.categoryId)}>
                      {category.name}
                    </option>
                  ))}
                  <option value="custom">Новая категория...</option>
                </select>
                {selectedCategoryId === "custom" ? (
                  <input
                    type="text"
                    placeholder="Введите новую категорию"
                    value={customCategoryName}
                    onChange={(event) => setCustomCategoryName(event.target.value)}
                    className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  />
                ) : null}
                {categoryLoadError ? (
                  <p className="text-xs text-destructive">
                    Не удалось загрузить категории: {categoryLoadError}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="date"
                placeholder="Дата начала"
                value={startDate}
                onChange={(event) => onStartDateChange(event.target.value)}
                className="h-11 rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <input
                type="date"
                placeholder="Дата окончания"
                min={startDate || undefined}
                value={endDate}
                onChange={(event) => onEndDateChange(event.target.value)}
                className="h-11 rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <input
              type="text"
              placeholder="Краткое описание маршрута"
              value={shortDescription}
              onChange={(event) => setShortDescription(event.target.value)}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />

            <textarea
              rows={5}
              placeholder="Описание поездки, заметки, список точек"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />

            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">
                Фото маршрута
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="h-11 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground file:mr-3 file:rounded-xl file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-foreground/85"
              />
              <p className="text-xs text-muted-foreground">
                {imageFile ? `Выбран файл: ${imageFile.name}` : "Файл не выбран"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button
                type="submit"
                variant="orange"
                disabled={saving}
                className="h-10 rounded-2xl px-4 text-sm font-semibold"
              >
                Сохранить маршрут
              </Button>
              <Button
                type="button"
                variant="transparent"
                disabled={saving}
                onClick={() => {
                  void saveRoute("public")
                }}
                className="h-10 rounded-2xl px-4 text-sm font-semibold text-[#588096]"
              >
                Опубликовать сразу
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

function validateDates(startDate: string, endDate: string): DateValidationResult {
  if (!startDate && !endDate) {
    return { valid: true, durationDays: null }
  }
  if (!startDate || !endDate) {
    return {
      valid: false,
      durationDays: null,
      message: "Укажите обе даты маршрута: начало и окончание.",
    }
  }

  const start = new Date(startDate)
  const end = new Date(endDate)
  const milliseconds = end.getTime() - start.getTime()
  if (!Number.isFinite(milliseconds)) {
    return { valid: false, durationDays: null, message: "Некорректные даты маршрута." }
  }
  if (milliseconds < 0) {
    return {
      valid: false,
      durationDays: null,
      message: "Дата окончания не может быть раньше даты начала.",
    }
  }

  const days = Math.floor(milliseconds / 86_400_000) + 1
  return { valid: true, durationDays: days > 0 ? days : null }
}
