import { instance } from "@/api/instance"
import type {
  AddRouteCategoryPayload,
  CreateRoutePayload,
  CreateRoutePointPayload,
  DeleteResultDto,
  RouteCategoryResponseDto,
  RoutePointResponseDto,
  RouteResponseDto,
  UpdateRoutePayload,
  UploadImageResponseDto,
} from "@/api/types"

export async function getAllRoutes(category?: string) {
  const normalizedCategory = category?.trim()
  const response = await instance.get<RouteResponseDto[]>("/routes", {
    params: normalizedCategory ? { category: normalizedCategory } : undefined,
  })
  return response.data
}

export async function getPublicRoutes() {
  const response = await instance.get<RouteResponseDto[]>("/routes/public")
  return response.data
}

export async function getRouteById(routeId: number) {
  const response = await instance.get<RouteResponseDto>(`/routes/${routeId}`)
  return response.data
}

export async function createRoute(payload: CreateRoutePayload) {
  const response = await instance.post<RouteResponseDto>("/routes", payload)
  return response.data
}

export async function updateRouteById(routeId: number, payload: UpdateRoutePayload) {
  const response = await instance.patch<RouteResponseDto>(
    `/routes/${routeId}`,
    payload
  )
  return response.data
}

export async function deleteRouteById(routeId: number) {
  const response = await instance.delete<DeleteResultDto>(`/routes/${routeId}`)
  return response.data
}

export async function uploadRouteImage(file: File) {
  const formData = new FormData()
  formData.append("image", file)

  const response = await instance.post<UploadImageResponseDto>(
    "/routes/upload-image",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  )
  return response.data
}

export async function publishRouteById(routeId: number) {
  const response = await instance.patch<RouteResponseDto>(
    `/routes/${routeId}/publish`
  )
  return response.data
}

export async function completeRouteById(routeId: number) {
  const response = await instance.patch<RouteResponseDto>(
    `/routes/${routeId}/complete`
  )
  return response.data
}

export async function addCategoryToRoute(
  routeId: number,
  payload: AddRouteCategoryPayload
) {
  const response = await instance.post<RouteCategoryResponseDto>(
    `/routes/${routeId}/categories`,
    payload
  )
  return response.data
}

export async function removeCategoryFromRoute(
  routeId: number,
  categoryId: number
) {
  const response = await instance.delete<RouteCategoryResponseDto>(
    `/routes/${routeId}/categories/${categoryId}`
  )
  return response.data
}

export async function getRoutePointsByRouteId(routeId: number) {
  const response = await instance.get<RoutePointResponseDto[]>(
    `/routes/${routeId}/points`
  )
  return response.data
}

export async function createRoutePointByRouteId(
  routeId: number,
  payload: CreateRoutePointPayload
) {
  const response = await instance.post<RoutePointResponseDto>(
    `/routes/${routeId}/points`,
    payload
  )
  return response.data
}
