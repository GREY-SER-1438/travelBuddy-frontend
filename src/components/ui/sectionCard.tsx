import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type SectionCardProps = {
  children: ReactNode
  className?: string
}

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-[32px] border border-border bg-card p-6 sm:p-8",
        className
      )}
    >
      {children}
    </section>
  )
}
