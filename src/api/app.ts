import { instance } from "@/api/instance"

export async function getHello() {
  const response = await instance.get<string>("/")
  return response.data
}
