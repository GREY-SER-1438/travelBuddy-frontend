import { useRef, useState, type ChangeEvent } from "react"
import { Link } from "react-router-dom"
import { MapPin, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  addCategoryToRoute,
  createRoute,
  createRoutePointByRouteId,
  uploadRouteImage,
} from "@/api/routes"
import { createCategory, getCategories } from "@/api/categories"
import { getRequestError } from "@/lib/get-request-error"

type DraftPoint = {
  id: number
  country: string
  city: string
  description: string
}

export default function PlannerPage() {
  const [title, setTitle] = useState("")
  const [categoryName, setCategoryName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  const [pointCountry, setPointCountry] = useState("")
  const [pointCity, setPointCity] = useState("")
  const [pointDescription, setPointDescription] = useState("")
  const [points, setPoints] = useState<DraftPoint[]>([])
  const [saving, setSaving] = useState(false)
  const [savedRouteId, setSavedRouteId] = useState<number | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const resetPlannerFields = () => {
    setTitle("")
    setCategoryName("")
    setStartDate("")
    setEndDate("")
    setShortDescription("")
    setDescription("")
    setPointCountry("")
    setPointCity("")
    setPointDescription("")
    setPoints([])
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const saveRoute = async (visibility: "private" | "public") => {
    const normalizedTitle = title.trim()
    if (!normalizedTitle) {
      toast.error("Укажите название маршрута.")
      return
    }

    setSaving(true)

    try {
      let uploadedImageUrl: string | undefined
      if (imageFile) {
        const uploaded = await uploadRouteImage(imageFile)
        uploadedImageUrl = uploaded.imageUrl
      }

      const durationDays = calculateDurationDays(startDate, endDate)
      const route = await createRoute({
        title: normalizedTitle,
        description: shortDescription.trim() || description.trim() || undefined,
        imageUrl: uploadedImageUrl,
        durationDays: durationDays ?? undefined,
        visibility,
      })

      const normalizedCategory = categoryName.trim()
      if (normalizedCategory) {
        const categories = await getCategories()
        const existingCategory = categories.find(
          (item) => item.name.trim().toLowerCase() === normalizedCategory.toLowerCase()
        )
        const categoryId =
          existingCategory?.categoryId ??
          (
            await createCategory({
              name: normalizedCategory,
              isPublic: visibility === "public",
            })
          ).categoryId

        await addCategoryToRoute(route.routeId, { categoryId })
      }

      for (let i = 0; i < points.length; i += 1) {
        const point = points[i]
        await createRoutePointByRouteId(route.routeId, {
          position: i + 1,
          country: point.country,
          city: point.city,
          description: point.description || undefined,
        })
      }

      setSavedRouteId(route.routeId)
      resetPlannerFields()
      toast.success(`Маршрут #${route.routeId} успешно сохранен.`)
    } catch (requestError) {
      toast.error(getRequestError(requestError))
    } finally {
      setSaving(false)
    }
  }

  const onAddPoint = () => {
    const country = pointCountry.trim()
    const city = pointCity.trim()
    const descriptionValue = pointDescription.trim()

    if (!country || !city) {
      toast.error("Для точки укажите страну и город.")
      return
    }

    setPoints((prev) => [
      ...prev,
      {
        id: Date.now(),
        country,
        city,
        description: descriptionValue,
      },
    ])
    setPointCountry("")
    setPointCity("")
    setPointDescription("")
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

  const onRemovePoint = (pointId: number) => {
    setPoints((prev) => prev.filter((point) => point.id !== pointId))
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
            Создание маршрута, точки поездки и карта собраны на одной странице.
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
              <input
                type="text"
                placeholder="Категория"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                className="h-11 rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="date"
                placeholder="Дата начала"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="h-11 rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <input
                type="date"
                placeholder="Дата окончания"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
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
                {imageFile
                  ? `Выбран файл: ${imageFile.name}`
                  : "Файл не выбран"}
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

            {savedRouteId ? (
              <Link
                to={`/routes/${savedRouteId}`}
                className="inline-flex text-sm font-semibold text-[#588096] hover:underline"
              >
                Открыть созданный маршрут
              </Link>
            ) : null}
          </form>

          <h2 className="mt-5 text-4xl leading-none font-bold text-foreground">
            Точки маршрута
          </h2>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Страна"
              value={pointCountry}
              onChange={(event) => setPointCountry(event.target.value)}
              className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
            <input
              type="text"
              placeholder="Город"
              value={pointCity}
              onChange={(event) => setPointCity(event.target.value)}
              className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
            <input
              type="text"
              placeholder="Описание точки"
              value={pointDescription}
              onChange={(event) => setPointDescription(event.target.value)}
              className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 sm:col-span-3"
            />
          </div>

          <div className="mt-4 space-y-3">
            {points.length === 0 ? (
              <p className="text-sm text-muted-foreground">Точки пока не добавлены.</p>
            ) : null}

            {points.map((point, index) => (
              <article
                key={point.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-muted px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-[#f04b4b]">
                    <MapPin className="size-4" />
                  </span>
                  <p className="truncate text-sm text-foreground/85">
                    {index + 1}. {point.country}, {point.city}
                    {point.description ? ` - ${point.description}` : ""}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="transparent"
                  onClick={() => onRemovePoint(point.id)}
                  className="h-9 rounded-xl px-4 text-sm font-semibold text-[#588096]"
                >
                  <Trash2 className="mr-1 size-4" />
                  Удалить
                </Button>
              </article>
            ))}
          </div>

          <Button
            type="button"
            variant="orange"
            onClick={onAddPoint}
            className="mt-4 h-10 w-full rounded-2xl text-sm font-semibold"
          >
            Добавить точку
          </Button>
        </section>
      </div>
    </div>
  )
}

function calculateDurationDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return null

  const start = new Date(startDate)
  const end = new Date(endDate)
  const milliseconds = end.getTime() - start.getTime()
  if (!Number.isFinite(milliseconds) || milliseconds < 0) return null

  const days = Math.floor(milliseconds / 86_400_000) + 1
  return days > 0 ? days : null
}
