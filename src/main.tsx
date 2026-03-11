import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { Toaster } from "@/components/ui/sonner"
import "./index.css"

document.documentElement.classList.remove("dark")
document.documentElement.classList.add("light")

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>
)
