import { instance } from "@/api/instance"
import type { ReportFormat } from "@/api/types"

type AccountReportResponse = {
  blob: Blob
  filename: string
}

export async function getAccountReport(
  format: ReportFormat = "html"
): Promise<AccountReportResponse> {
  const response = await instance.get<Blob>("/reports/account", {
    params: { format },
    responseType: "blob",
  })

  const contentDispositionHeader = String(
    response.headers["content-disposition"] || ""
  )

  return {
    blob: response.data,
    filename:
      extractFilenameFromContentDisposition(contentDispositionHeader) ||
      `account-report.${format}`,
  }
}

function extractFilenameFromContentDisposition(value: string) {
  if (!value) return ""

  const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1].trim().replace(/^"|"$/g, ""))
  }

  const plainMatch = value.match(/filename=([^;]+)/i)
  if (plainMatch?.[1]) {
    return plainMatch[1].trim().replace(/^"|"$/g, "")
  }

  return ""
}
