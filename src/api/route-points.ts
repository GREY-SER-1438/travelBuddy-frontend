import { instance } from "@/api/instance"
import type {
  MessageResponseDto,
  RoutePointResponseDto,
  UpdateRoutePointPayload,
} from "@/api/types"

export async function updateRoutePointById(
  pointId: number,
  payload: UpdateRoutePointPayload
) {
  const response = await instance.patch<RoutePointResponseDto>(
    `/points/${pointId}`,
    payload
  )
  return response.data
}

export async function deleteRoutePointById(pointId: number) {
  const response = await instance.delete<MessageResponseDto>(`/points/${pointId}`)
  return response.data
}
