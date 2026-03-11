import React from "react"
import { Outlet } from "react-router-dom"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="w-full flex-1 pb-2">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
