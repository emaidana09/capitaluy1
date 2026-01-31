import { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AdminPricePanel from "@/components/admin-price-panel"

export const metadata: Metadata = {
  title: "Admin - Capitaluy",
  description: "Panel de administracion de precios",
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <AdminPricePanel />
      </div>
      <Footer />
    </main>
  )
}
