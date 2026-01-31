import { Metadata } from "next"
import AdminPageClient from "@/components/admin-page-client"

export const metadata: Metadata = {
  title: "Admin - CapitalUY",
  description: "Panel de administracion de precios",
}

export default function AdminPage() {
  return <AdminPageClient />
}
