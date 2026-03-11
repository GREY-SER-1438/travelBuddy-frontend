import { instance } from "@/api/instance"
import type {
  MessageResponseDto,
  SavedRouteResponseDto,
} from "@/api/types"

export async function saveRouteById(routeId: number) {
  const response = await instance.post<SavedRouteResponseDto>(`/saved/${routeId}`)
  return response.data
}

export async function removeSavedRouteById(routeId: number) {
  const response = await instance.delete<MessageResponseDto>(`/saved/${routeId}`)
  return response.data
}

export async function getSavedRoutes() {
  const response = await instance.get<SavedRouteResponseDto[]>("/saved")
  return response.data
}
