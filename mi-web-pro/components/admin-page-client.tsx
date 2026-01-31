"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AdminLogin from "@/components/admin-login"
import AdminPricePanel from "@/components/admin-price-panel"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminPageClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth")
      const data = await res.json()
      setIsAuthenticated(data.authenticated === true)
    } catch {
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    })
    setIsAuthenticated(false)
  }

  if (isAuthenticated === null) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </main>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="fixed top-24 right-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="bg-card border-border gap-2"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesion
        </Button>
      </div>
      <div className="pt-20">
        <AdminPricePanel />
      </div>
      <Footer />
    </main>
  )
}
