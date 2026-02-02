"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import { useConfig } from "@/lib/config-context"
import { Mail, Phone, MapPin, Instagram, Twitter } from "lucide-react"

export default function ContactContent() {
  const { config } = useConfig()
  const waLink = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent("Hola, tengo una consulta")}`
  const normalize = (u: string | undefined) => {
    if (!u) return "#"
    const s = String(u).trim()
    if (s === "#" || s === "") return "#"
    return /^https?:\/\//i.test(s) ? s : `https://${s}`
  }

  return (
    <main className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header />
      <div className="pt-24 pb-16">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contacto</h1>
          <p className="text-muted-foreground mb-8">Si tenes dudas o queres coordinar una operacion, contactanos por cualquiera de los canales abajo.</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Correo</h3>
              </div>
              <a href={`mailto:${config.email}`} className="text-foreground hover:underline">{config.email}</a>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">WhatsApp / Teléfono</h3>
              </div>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">{config.phone_display}</a>
              <p className="text-sm text-muted-foreground mt-2">Respondemos rapido durante horario laboral.</p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Dirección</h3>
              </div>
              <div className="text-foreground">{config.address}</div>
              <div className="mt-4 flex gap-3">
                <a href={normalize(config.instagram_url)} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href={normalize(config.twitter_url)} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
