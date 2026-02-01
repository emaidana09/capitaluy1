import { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import NosotrosContent from "@/components/nosotros-content"

export const metadata: Metadata = {
  title: "Nosotros - CapitalUY",
  description: "Conoce a CapitalUY, tu plataforma de confianza para comprar y vender USDT en Uruguay",
}

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header />
      <div className="pt-20">
        <NosotrosContent />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
