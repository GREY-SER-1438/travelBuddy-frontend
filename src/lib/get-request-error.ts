import axios from "axios"

export function getRequestError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message

    if (typeof message === "string" && message.trim().length > 0) {
      return message
    }

    return "Ошибка запроса. Проверьте данные и попробуйте снова."
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return "Произошла неизвестная ошибка."
}
