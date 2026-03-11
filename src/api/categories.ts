import { instance } from "@/api/instance"
import type {
  CategoryResponseDto,
  CreateCategoryPayload,
} from "@/api/types"

export async function getCategories() {
  const response = await instance.get<CategoryResponseDto[]>("/categories")
  return response.data
}

export async function createCategory(payload: CreateCategoryPayload) {
  const response = await instance.post<CategoryResponseDto>("/categories", payload)
  return response.data
}
