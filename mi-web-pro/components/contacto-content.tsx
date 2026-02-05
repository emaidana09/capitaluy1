"use client"


import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import { useConfig } from "@/lib/config-context"
import { Mail, Phone, MapPin, Instagram, Twitter, Send } from "lucide-react"
import { useEffect, useState } from "react"

export default function ContactContent() {
  const { config } = useConfig()
  const waLink = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent("Hola, tengo una consulta")}`
  const normalize = (u: string | undefined) => {
    if (!u) return "#"
    const s = String(u).trim()
    if (s === "#" || s === "") return "#"
    return /^https?:\/\//i.test(s) ? s : `https://${s}`
  }

  const [contactMsg, setContactMsg] = useState({
    contact_message_title: "",
    contact_message_body: ""
  })

  useEffect(() => {
    fetch("/api/contact-message")
      .then(res => res.json())
      .then(setContactMsg)
  }, [])

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
                <h3 className="font-semibold">WhatsApp</h3>
              </div>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">{config.phone_display}</a>
              <p className="text-sm text-muted-foreground mt-2">Respondemos rápido durante horario laboral.</p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <Send className="w-5 h-5 text-white" />
                <h3 className="font-semibold text-white">Redes</h3>
              </div>
              <div className="mt-2 flex gap-4 justify-start items-center">
                <a href={normalize(config.instagram_url)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href={normalize(config.telegram_url)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M9.993 15.545l-.396 4.01c.567 0 .813-.244 1.112-.538l2.67-2.553 5.543 4.04c1.016.56 1.747.265 2.01-.94l3.644-17.07c.334-1.53-.553-2.13-1.54-1.77L1.36 9.13c-1.49.58-1.47 1.41-.254 1.78l4.37 1.364 10.16-6.41c.478-.309.913-.137.555.172"/></svg>
                </a>
                <a href={normalize(config.twitter_url)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-8 mb-6">
            <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-b from-green-900 via-green-800 to-black p-8 w-full max-w-md shadow-xl">
              <div className="relative z-10">
                <p className="text-2xl font-bold text-green-100 text-center mb-2">
                  {contactMsg.contact_message_title}
                </p>
                <p className="text-base md:text-lg text-green-200 text-center font-normal">
                  {contactMsg.contact_message_body}
                </p>
              </div>
              {/* Decorativo: Glow verde arriba derecha */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-80 pointer-events-none" />
              {/* Decorativo: Glow verde abajo izquierda */}
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-400/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 opacity-60 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
