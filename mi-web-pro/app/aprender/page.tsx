import { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import CoursesSection from "@/components/courses-section"

export const metadata: Metadata = {
  title: "Aprender - Capitaluy",
  description: "Cursos y talleres sobre criptomonedas para todos los niveles",
}

export default function AprenderPage() {
  return (
    <main className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header />
      <div className="pt-20">
        <CoursesSection />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
